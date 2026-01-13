import { useEffect, useState } from "react";
import { weatherApi } from "../api/weatherApi";
import { cacheManager } from "../utils/cacheManager";
import HourlyForecast from "./HourlyForecast";
import DailyForecast from "./DailyForecast";
import LocationSearch from "./LocationSearch";

export default function Weather() {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [unit, setUnit] = useState("C");
  const [theme, setTheme] = useState("light");
  const [view, setView] = useState("hourly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isDark = theme === "dark";

  useEffect(() => {
    const savedUnit = cacheManager.getPreferences("temperatureUnit");
    const savedTheme = cacheManager.getPreferences("themeMode");

    if (savedUnit) setUnit(savedUnit);
    if (savedTheme) setTheme(savedTheme);

    requestUserLocation();
  }, []);

  const requestUserLocation = () => {
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await fetchWeather({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      () => {
        setError("Location access denied");
        setLoading(false);
      }
    );
  };

  const fetchWeather = async (coords) => {
    try {
      setLoading(true);
      setError(null);

      const units = unit === "C" ? "metric" : "imperial";
      const place = await weatherApi.getLocationName(coords);
      const data = await weatherApi.getWeatherByCoordinates(coords, units);

      setLocation(place);
      setWeather(data);
    } catch {
      setError("Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    cacheManager.setPreferences("themeMode", next);
  };

  const toggleUnit = () => {
    const next = unit === "C" ? "F" : "C";
    setUnit(next);
    cacheManager.setPreferences("temperatureUnit", next);
  };

  return (
    <div className={`app ${theme}`}>
      <header className="header">
        <h1>Weather</h1>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={toggleUnit}>°{unit}</button>
          <button onClick={toggleTheme}>{isDark ? "☀️" : "🌙"}</button>
        </div>
      </header>

      <div className="main-content">
        <LocationSearch onSelect={fetchWeather} />

        {loading && <p className="loading">Loading weather data…</p>}
        {error && <p className="error">⚠️ {error}</p>}

        {weather && (
          <div className="weather-display">
            <h2>
              {location?.name}, {location?.country}
            </h2>
            <div className="temperature">
              {Math.round(weather.current.temperature)}°
            </div>
            <p className="description">{weather.current.description}</p>

            <div className="weather-details">
              <div className="detail-card">
                <p>Feels Like</p>
                <p>{Math.round(weather.current.feelsLike)}°</p>
              </div>
              <div className="detail-card">
                <p>Humidity</p>
                <p>{weather.current.humidity}%</p>
              </div>
              <div className="detail-card">
                <p>Wind Speed</p>
                <p>{weather.current.windSpeed} m/s</p>
              </div>
              <div className="detail-card">
                <p>Pressure</p>
                <p>{weather.current.pressure} hPa</p>
              </div>
            </div>

            <div className="toggle">
              <button
                onClick={() => setView("hourly")}
                style={{
                  opacity: view === "hourly" ? 1 : 0.6,
                  fontWeight: view === "hourly" ? "bold" : "normal",
                }}
              >
                Hourly
              </button>
              <button
                onClick={() => setView("daily")}
                style={{
                  opacity: view === "daily" ? 1 : 0.6,
                  fontWeight: view === "daily" ? "bold" : "normal",
                }}
              >
                7-Day
              </button>
            </div>

            {view === "hourly" ? (
              <HourlyForecast data={weather.hourly} unit={unit} />
            ) : (
              <DailyForecast data={weather.daily} unit={unit} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
