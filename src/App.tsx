import React, { useEffect, useState } from "react";
import "./App.css";
import WeatherCard from "./components/WeatherCard";
import ForecastCard from "./components/ForecastCard";
import Settings from "./components/Settings";
import Notification from "./components/Notification";
import WeatherApp from "./components/FetchData";
import Nav from "./components/Nav";
import Header from "./components/Header";
import type {
  WeatherData,
  ForecastData,
  Location,
  HourlyForecastData,
} from "./types";

const App: React.FC = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null
  );
  const [dailyForecast, setDailyForecast] = useState<ForecastData[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecastData[]>(
    []
  );
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [notification, setNotification] = useState("");
  const [view, setView] = useState<"daily" | "hourly">("daily");

  // Load from localStorage & geolocation
  useEffect(() => {
    const saved = localStorage.getItem("weatherApp");
    if (saved) {
      const data = JSON.parse(saved);
      setTheme(data.theme || "light");
      setUnits(data.units || "metric");
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc: Location = {
            name: "Current Location",
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            isCurrentLocation: true,
          };
          setSelectedLocation(loc);
        },
        () => {
          setNotification("Unable to retrieve your location");
          setTimeout(() => setNotification(""), 3000);
        }
      );
    }
  }, []);

  // Fetch weather from API
  const fetchWeather = async (loc: Location) => {
    try {
      setNotification("Loading weather...");
      const url = `https://open-weather13.p.rapidapi.com/fivedaysforcast?latitude=${loc.lat}&longitude=${loc.lon}&lang=EN`;
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "befc0e925cmshbdf815616b8d6a2p1e5affjsn0bb98f238035",
          "x-rapidapi-host": "open-weather13.p.rapidapi.com",
        },
      };

      const response = await fetch(url, options);
      const data = await response.json();
      console.log(data);

      // Current weather
      const current: WeatherData = {
        temperature: data.current.temp,
        windSpeed: data.current.wind_speed,
        humidity: data.current.humidity,
        description: data.current.weather[0].description,
      };

      // Daily forecast
      const daily: ForecastData[] = data.daily.map((d: any) => ({
        date: new Date(d.dt * 1000).toISOString(), // convert timestamp to date
        temp: d.temp.day,
        description: d.weather[0].description,
      }));

      // Hourly forecast
      const hourly: HourlyForecastData[] = data.hourly.map((h: any) => ({
        time: new Date(h.dt * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        temp: h.temp,
        description: h.weather[0].description,
      }));

      setCurrentWeather(current);
      setDailyForecast(daily);
      setHourlyForecast(hourly);

      setNotification(`Weather updated for ${loc.name}`);
      setTimeout(() => setNotification(""), 3000);

      // Cache for offline
      localStorage.setItem(
        `weather-${loc.name}`,
        JSON.stringify({ current, daily, hourly })
      );
    } catch (err) {
      console.error(err);
      setNotification("Failed to fetch weather data");
      setTimeout(() => setNotification(""), 3000);
    }
  };

  // Load weather when selected location changes
  useEffect(() => {
    if (!selectedLocation) return;

    if (!navigator.onLine) {
      const cached = localStorage.getItem(`weather-${selectedLocation.name}`);
      if (cached) {
        const data = JSON.parse(cached);
        setCurrentWeather(data.current);
        setDailyForecast(data.daily);
        setHourlyForecast(data.hourly);
        setNotification("Using cached data (offline)");
        setTimeout(() => setNotification(""), 3000);
        return;
      }
    }

    fetchWeather(selectedLocation);
  }, [selectedLocation]);

  return (
    <div className={`app-container ${theme}`}>
        <Header />

      <div className={`app-content ${theme}`}>
        <WeatherApp />
        <Notification message={notification} />
        <Settings
          theme={theme}
          units={units}
          setTheme={setTheme}
          setUnits={setUnits}
        />

        {currentWeather && (
          <WeatherCard weather={currentWeather} units={units} />
        )}

        <div className="forecast-toggle">
          <button
            onClick={() => setView("daily")}
            className={view === "daily" ? "active" : ""}
          >
            Daily
          </button>
          <button
            onClick={() => setView("hourly")}
            className={view === "hourly" ? "active" : ""}
          >
            Hourly
          </button>
        </div>

        <ForecastCard
          daily={dailyForecast}
          hourly={hourlyForecast}
          view={view}
          units={units}
          theme={theme}
        />
      </div>
    </div>
  );
};

export default App;
