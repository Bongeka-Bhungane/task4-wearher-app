import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ForecastCard from "./components/ForecastCard";
import SavedLocations from "./components/SavedLocations";
import Settings from "./components/Settings";
import Notification from "./components/Notification";
import Header from "./components/Header";
import WeatherApp from "./components/FetchData";
import {
  fetchCurrentWeather,
  fetchForecast,
  fetchHourlyForecast,
} from "./api/WeatherApi";
import  type{
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
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);
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
      setSavedLocations(data.locations || []);
      setTheme(data.theme || "light");
      setUnits(data.units || "metric");
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const loc: Location = {
          name: "Current Location",
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          isCurrentLocation: true,
        };
        setSelectedLocation(loc);
      });
    }
  }, []);

  // Load weather whenever location or units change
  useEffect(() => {
    if (!selectedLocation) return;

    const loadWeatherData = async () => {
      try {
        if (!navigator.onLine) {
          const cached = localStorage.getItem(
            `weather-${selectedLocation.name}`
          );
          if (cached) {
            const data = JSON.parse(cached);
            setCurrentWeather(data.currentWeather);
            setDailyForecast(data.dailyForecast);
            setHourlyForecast(data.hourlyForecast);
            setNotification("Using cached data (offline)");
            setTimeout(() => setNotification(""), 3000);
            return;
          } else {
            setNotification("Offline & no cached data");
            setTimeout(() => setNotification(""), 3000);
            return;
          }
        }

        const weather = await fetchCurrentWeather(selectedLocation, units);
        const daily = await fetchForecast(selectedLocation, units);
        const hourly = await fetchHourlyForecast(selectedLocation, units);
        setCurrentWeather(weather);
        setDailyForecast(daily);
        setHourlyForecast(hourly);

        // Cache for offline
        localStorage.setItem(
          `weather-${selectedLocation.name}`,
          JSON.stringify({
            currentWeather: weather,
            dailyForecast: daily,
            hourlyForecast: hourly,
          })
        );
        setNotification(`Weather updated for ${selectedLocation.name}`);
        setTimeout(() => setNotification(""), 3000);
      } catch {
        setNotification("Failed to load weather data");
      }
    };

    loadWeatherData();
  }, [selectedLocation, units]);

  const handleSearch = (location: Location) => {
    setSelectedLocation(location);
    if (!savedLocations.find((l) => l.name === location.name)) {
      const updated = [...savedLocations, location];
      setSavedLocations(updated);
      localStorage.setItem(
        "weatherApp",
        JSON.stringify({ locations: updated, theme, units })
      );
    }
  };

  const removeLocation = (name: string) => {
    const updated = savedLocations.filter((l) => l.name !== name);
    setSavedLocations(updated);
    localStorage.setItem(
      "weatherApp",
      JSON.stringify({ locations: updated, theme, units })
    );
  };

  return (
    <div
      className={
        theme === "dark"
          ? "bg-gray-900 text-white min-h-screen p-4"
          : "bg-blue-200 min-h-screen p-4"
      }
    >
      <Header />
      <Sidebar />
      <WeatherApp />
      <Notification message={notification} />
      <SearchBar onSearch={handleSearch} />
      <Settings
        theme={theme}
        units={units}
        setTheme={setTheme}
        setUnits={setUnits}
      />

      {currentWeather && <WeatherCard weather={currentWeather} units={units} />}

      {/* Forecast Toggle */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setView("daily")}
          className={`px-4 py-2 mr-2 rounded ${
            view === "daily" ? "bg-white/30" : "bg-white/10"
          }`}
        >
          Daily
        </button>
        <button
          onClick={() => setView("hourly")}
          className={`px-4 py-2 rounded ${
            view === "hourly" ? "bg-white/30" : "bg-white/10"
          }`}
        >
          Hourly
        </button>
      </div>

      <ForecastCard daily={dailyForecast} hourly={hourlyForecast} view={view} />

      <SavedLocations
        locations={savedLocations}
        onSelect={setSelectedLocation}
        onRemove={removeLocation}
      />
    </div>
  );
};

export default App;
