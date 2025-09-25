import React, { useState, useEffect } from "react";

export default function TemperatureSearch() {
  const [city, setCity] = useState("Durban"); // 👈 default city
  const [temperature, setTemperature] = useState<number | null>(null);
  const [error, setError] = useState("");

  const fetchWeather = async (cityName: string) => {
    setError("");
    setTemperature(null);

    const url = `https://yahoo-weather5.p.rapidapi.com/weather?location=${encodeURIComponent(
      cityName
    )}&format=json&u=c`; // Celsius

    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "befc0e925cmshbdf815616b8d6a2p1e5affjsn0bb98f238035",
        "x-rapidapi-host": "yahoo-weather5.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      console.log("API Response:", data);

      const tempCelsius =
        data.current_observation?.condition?.temperature ?? null;

      if (tempCelsius !== null) {
        setTemperature(tempCelsius);
      } else {
        setError("Temperature not found in API response");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch weather data");
    }
  };

  // 👇 Run once when component mounts (for default city)
  useEffect(() => {
    fetchWeather(city);
  }, []);

  return (
    <div style={{ padding: "1rem", maxWidth: "400px", margin: "auto" }}>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{ padding: "0.5rem", width: "70%", marginRight: "0.5rem" }}
      />
      <button
        onClick={() => fetchWeather(city)}
        style={{ padding: "0.5rem 1rem" }}
      >
        Search
      </button>

      {error && (
        <p style={{ marginTop: "1rem", color: "red", fontWeight: "bold" }}>
          {error}
        </p>
      )}

      {temperature !== null && (
        <div style={{ marginTop: "1rem" }}>
          <p style={{ fontWeight: "bold" }}>
            Temperature in {city}: {temperature} °C
          </p>
        </div>
      )}
    </div>
  );
}
