import { useEffect, useState } from "react";
import { weatherApi } from "../api/weatherApi";
import { cacheManager } from "../utils/cacheManager";
import HourlyForecast from "./HourlyForecast";
import DailyForecast from "./DailyForecast";
import LocationSearch from "./LocationSearch";
import type {
  WeatherData,
  TemperatureUnit,
  Coordinates,
  Location,
} from "../types";
import { mapWeatherApiToUi } from "../utils/weatherMapper";

type ViewMode = "hourly" | "daily";
type ThemeMode = "light" | "dark";

export default function Weather() {
  const [location, setLocation] = useState<Location | null>(null);
  const [baseWeather, setBaseWeather] = useState<WeatherData | null>(null); // Always in Celsius
  const [unit, setUnit] = useState<TemperatureUnit>("C");
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [view, setView] = useState<ViewMode>("hourly");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isDark = theme === "dark";

  // Only Celsius → Fahrenheit is needed
  const cToF = (c: number) => (c * 9) / 5 + 32;

  // Compute weather for display based on unit
  const getDisplayWeather = (): WeatherData | null => {
    if (!baseWeather) return null;

    const convertTemp = (temp: number) =>
      unit === "F" ? Math.round(cToF(temp)) : Math.round(temp);

    return {
      current: {
        ...baseWeather.current,
        temperature: convertTemp(baseWeather.current.temperature),
        feelsLike: convertTemp(baseWeather.current.feelsLike),
      },
      hourly: baseWeather.hourly.map((h) => ({
        ...h,
        temperature: convertTemp(h.temperature),
      })),
      daily: baseWeather.daily.map((d) => ({
        ...d,
        maxTemperature: convertTemp(d.maxTemperature),
        minTemperature: convertTemp(d.minTemperature),
      })),
    };
  };

  useEffect(() => {
    const savedUnit =
      cacheManager.getPreferences<TemperatureUnit>("temperatureUnit");
    const savedTheme = cacheManager.getPreferences<ThemeMode>("themeMode");

    if (savedUnit === "C" || savedUnit === "F") setUnit(savedUnit);
    if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);

    requestUserLocation();
  }, []);

  const requestUserLocation = () => {
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        fetchWeather({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      () => {
        setError("Location access denied");
        setLoading(false);
      }
    );
  };

  const fetchWeather = async (coords: Coordinates) => {
    try {
      setLoading(true);
      setError(null);

      // Always fetch in metric (Celsius) for consistent base
      const place = await weatherApi.getLocationName(coords);
      const apiData = await weatherApi.getWeatherByCoordinates(
        coords,
        "metric"
      );

      setLocation({
        name: place.name,
        country: place.country,
        lat: coords.latitude,
        lon: coords.longitude,
      });

      setBaseWeather(mapWeatherApiToUi(apiData)); // store in Celsius
    } catch {
      setError("Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    const next: ThemeMode = theme === "light" ? "dark" : "light";
    setTheme(next);
    cacheManager.setPreferences("themeMode", next);
  };

  // Toggle unit (C ↔ F)
  const toggleUnit = () => {
    const next: TemperatureUnit = unit === "C" ? "F" : "C";
    setUnit(next);
    cacheManager.setPreferences("temperatureUnit", next);
  };

  const weather = getDisplayWeather();

  return (
    <div className={`app ${theme}`}>
      <header className="header">
        <h1>Weather</h1>
        <div className="actions" style={{ display: "flex", gap: "0.5rem" }}>
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
              {weather.current.temperature}°
            </div>
            <p className="description">
              {weather.current.description}
            </p>

            <div className="weather-details">
              <div className="detail-card">
                <p>Feels Like</p>
                <p>{weather.current.feelsLike}°</p>
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
