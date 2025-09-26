import React, { useState, useEffect } from "react";
import SavedLocations from "./SavedLocations";
import type { Location } from "../types";

interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

const WeatherApp: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [city, setCity] = useState("");
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [currentCity, setCurrentCity] = useState(""); // store city name
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);

  const weatherCodeToEmoji = (code: number) => {
    switch (code) {
      case 0:
        return "☀️";
      case 1:
        return "🌤️";
      case 2:
        return "⛅";
      case 3:
        return "☁️";
      case 61:
        return "🌧️";
      case 71:
        return "❄️";
      default:
        return "🌈";
    }
  };

  const fetchWeather = async (
    latitude: number,
    longitude: number,
    name?: string
  ) => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const data = await response.json();
      if (data.current_weather) {
        setWeather(data.current_weather);
        if (name) setCurrentCity(name); // update city name
      } else {
        setError("Weather data not found");
      }
    } catch {
      setError("Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  const fetchCoordinates = async (cityName: string) => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          cityName
        )}&count=1`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const { latitude, longitude, name } = data.results[0];
        setCoords({ latitude, longitude });
        fetchWeather(latitude, longitude, name);

        const newLocation: Location = { name, lat: latitude, lon: longitude };
        setSavedLocations((prev) => {
          const exists = prev.some((l) => l.name === name);
          if (!exists) {
            const updated = [...prev, newLocation];
            localStorage.setItem("savedLocations", JSON.stringify(updated));
            return updated;
          }
          return prev;
        });
      } else {
        setError("City not found");
      }
    } catch {
      setError("Failed to fetch coordinates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("savedLocations");
    if (stored) setSavedLocations(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (!coords && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoords({ latitude, longitude });
          fetchWeather(latitude, longitude, "Current Location");
        },
        () => {
          setError("Unable to retrieve your location");
        }
      );
    }
  }, [coords]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim() !== "") {
      fetchCoordinates(city.trim());
      setCity("");
    }
  };

  const handleSelectSaved = (loc: Location) => {
    setCoords({ latitude: loc.lat, longitude: loc.lon });
    fetchWeather(loc.lat, loc.lon, loc.name);
  };

  const handleRemove = (name: string) => {
    const updated = savedLocations.filter((l) => l.name !== name);
    setSavedLocations(updated);
    localStorage.setItem("savedLocations", JSON.stringify(updated));
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1>Weather App</h1>

      <form onSubmit={handleSearch} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ padding: "0.5rem", fontSize: "1rem" }}
        />
        <button
          type="submit"
          style={{ padding: "0.5rem", marginLeft: "0.5rem" }}
        >
          Search
        </button>
      </form>

      {loading && <p>Loading weather...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && coords && (
        <>
          <p>City: {currentCity}</p>
          <p>
            Coordinates: {coords.latitude.toFixed(2)},{" "}
            {coords.longitude.toFixed(2)}
          </p>
          <p>Temperature: {weather.temperature}°C</p>
          <p>Wind Speed: {weather.windspeed} km/h</p>
          <p>Condition: {weatherCodeToEmoji(weather.weathercode)}</p>

          <SavedLocations
            locations={savedLocations}
            onSelect={handleSelectSaved}
            onRemove={handleRemove}
          />
        </>
      )}
    </div>
  );
};

export default WeatherApp;
