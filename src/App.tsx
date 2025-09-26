import React, { useState, useEffect, useCallback } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ForecastCard from "./components/ForecastCard";
import SavedLocations from "./components/SavedLocations";
import { fetchCurrentWeather, fetchForecast } from "./api/WeatherApi";
import type { WeatherData, ForecastData, Location } from "./types";
import Sidebar from "./components/Sidebar";

const App: React.FC = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null
  );
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [units, setUnits] = useState<"metric" | "imperial">("metric");

  // Load from localStorage once
  useEffect(() => {
    const saved = localStorage.getItem("weatherApp");
    if (saved) {
      const data = JSON.parse(saved);
      setSavedLocations(data.locations || []);
      setUnits(data.units || "metric");
    }
  }, []);

  // ✅ Memoize loadWeather
  const loadWeather = useCallback(
    async (location: Location) => {
      const weather = await fetchCurrentWeather(location, units);
      const forecastData = await fetchForecast(location, units);
      setCurrentWeather(weather);
      setForecast(forecastData);
    },
    [units] // depends only on units
  );

  // Effect depends on loadWeather + selectedLocation
  useEffect(() => {
    if (selectedLocation) {
      loadWeather(selectedLocation);
    }
  }, [selectedLocation, loadWeather]);

  const handleSearch = (location: Location) => {
    setSelectedLocation(location);
    if (!savedLocations.find((l) => l.name === location.name)) {
      const updated = [...savedLocations, location];
      setSavedLocations(updated);
      localStorage.setItem(
        "weatherApp",
        JSON.stringify({ locations: updated, units })
      );
    }
  };

  const removeLocation = (name: string) => {
    const updated = savedLocations.filter((l) => l.name !== name);
    setSavedLocations(updated);
    localStorage.setItem(
      "weatherApp",
      JSON.stringify({ locations: updated, units })
    );
  };

  return (
    <div className="p-4">
      <Sidebar />
      <SearchBar onSearch={handleSearch} />
      {currentWeather && <WeatherCard weather={currentWeather} units={units} />}
      {forecast.length > 0 && <ForecastCard forecast={forecast} />}
      <SavedLocations
        locations={savedLocations}
        onSelect={setSelectedLocation}
        onRemove={removeLocation}
      />
    </div>
  );
};

export default App;
