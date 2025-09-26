// WeatherApp.tsx
import React, { useState, useEffect } from "react";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [city, setCity] = useState("");
  const [coords, setCoords] = useState<Coordinates | null>(null);

  // Map weather codes to emojis
  const weatherCodeToEmoji = (code: number) => {
    switch (code) {
      case 0: return "☀️";
      case 1: return "🌤️";
      case 2: return "⛅";
      case 3: return "☁️";
      case 61: return "🌧️";
      case 71: return "❄️";
      default: return "🌈";
    }
  };

  // Fetch weather from Open-Meteo
  const fetchWeather = async (latitude: number, longitude: number) => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const data = await response.json();
      setWeather(data.current_weather);
    } catch (err) {
      setError("Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch coordinates from city name
  const fetchCoordinates = async (cityName: string) => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const { latitude, longitude } = data.results[0];
        setCoords({ latitude, longitude });
        fetchWeather(latitude, longitude);
      } else {
        setError("City not found");
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to fetch coordinates");
      setLoading(false);
    }
  };

  // Get weather on initial load using current location
  useEffect(() => {
    if (!coords && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoords({ latitude, longitude });
          fetchWeather(latitude, longitude);
        },
        () => {
          setError("Unable to retrieve your location");
          setLoading(false);
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
        <button type="submit" style={{ padding: "0.5rem", marginLeft: "0.5rem" }}>
          Search
        </button>
      </form>

      {loading && <p>Loading weather...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && coords && (
        <div>
          <p>
            Location: {coords.latitude.toFixed(2)}, {coords.longitude.toFixed(2)}
          </p>
          <p>Temperature: {weather.temperature}°C</p>
          <p>Wind Speed: {weather.windspeed} km/h</p>
          <p>Condition: {weatherCodeToEmoji(weather.weathercode)}</p>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
