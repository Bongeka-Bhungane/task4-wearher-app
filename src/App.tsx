import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const saved = localStorage.getItem("weatherApp");
    if (saved) {
      const data = JSON.parse(saved);
      setSavedLocations(data.locations || []);
      setUnits(data.units || "metric");
    }
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      loadWeather(selectedLocation);
    }
  }, [selectedLocation, units]);

  const loadWeather = async (location: Location) => {
    const weather = await fetchCurrentWeather(location, units);
    const forecastData = await fetchForecast(location, units);
    setCurrentWeather(weather);
    setForecast(forecastData);
  };

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
