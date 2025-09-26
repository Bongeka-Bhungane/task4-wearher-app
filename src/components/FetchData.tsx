import React, { useState, useEffect } from "react";
import SavedLocations from "./SavedLocations";
import WeatherCard from "./WeatherCard";
import type { Location, DailyWeatherData } from "../types";

interface Coordinates {
  latitude: number;
  longitude: number;
}

const WeatherApp: React.FC = () => {
  const [dailyWeather, setDailyWeather] = useState<DailyWeatherData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [city, setCity] = useState("");
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [currentCity, setCurrentCity] = useState("");
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);

  // Map weather codes to emojis
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

  const fetchDailyWeather = async (
    latitude: number,
    longitude: number,
    name?: string
  ) => {
    try {
      setLoading(true);
      setError("");

      // Open-Meteo daily forecast API
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.daily) {
        const dailyData: DailyWeatherData[] = data.daily.time.map(
          (date: string, i: number) => ({
            date,
            temperatureMax: data.daily.temperature_2m_max[i],
            temperatureMin: data.daily.temperature_2m_min[i],
            weatherCode: data.daily.weathercode[i],
          })
        );

        setDailyWeather(dailyData);
        if (name) setCurrentCity(name);
      } else {
        setError("Daily weather data not found");
      }
    } catch {
      setError("Failed to fetch daily weather data");
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
        fetchDailyWeather(latitude, longitude, name);

        // Save location
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
          fetchDailyWeather(latitude, longitude, "Current Location");
        },
        () => setError("Unable to retrieve your location")
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
    fetchDailyWeather(loc.lat, loc.lon, loc.name);
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

      {dailyWeather.length > 0 && (
        <>
          <p>City: {currentCity}</p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {dailyWeather.map((day) => (
              <WeatherCard
                key={day.date}
                weather={{
                  description: weatherCodeToEmoji(day.weatherCode),
                  temperature: day.temperatureMax,
                  humidity: 0, // optional
                  windSpeed: 0, // optional
                  date: day.date, // pass the date
                }}
                units="metric"
              />
            ))}
          </div>

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
