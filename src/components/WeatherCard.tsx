import React from "react";
import type { WeatherData } from "../types";
import { convertTemperature } from "../api/WeatherApi"

interface Props {
  weather: WeatherData & { date?: string };
  units: "metric" | "imperial";
}

const WeatherCard: React.FC<Props> = ({ weather, units }) => {
  const dayName = weather.date
    ? new Date(weather.date).toLocaleDateString(undefined, { weekday: "short" })
    : "";

  return (
    <div className="weather-card">
      {dayName && <p className="weather-day">{dayName}</p>}
      <h2 className="weather-description">{weather.description}</h2>
      <p className="weather-temp">
        {convertTemperature(
          weather.temperature,
          "metric",
          units
        ).toFixed(1)}
        °{units === "metric" ? "C" : "F"}
      </p>

      {weather.humidity !== undefined && (
        <p className="weather-humidity">Humidity: {weather.humidity}%</p>
      )}
      {weather.windSpeed !== undefined && (
        <p className="weather-wind">
          Wind: {weather.windSpeed} {units === "metric" ? "km/h" : "mph"}
        </p>
      )}
    </div>
  );
};

export default WeatherCard;
