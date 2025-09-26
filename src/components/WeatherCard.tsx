import React from "react";
import type { WeatherData } from "../types";

interface Props {
  weather: WeatherData;
  units: "metric" | "imperial";
}

const WeatherCard: React.FC<Props> = ({ weather, units }) => (
  <div className="weather-card">
    <h2 className="weather-description">{weather.description}</h2>
    <p className="weather-temp">
      {weather.temperature}°{units === "metric" ? "C" : "F"}
    </p>
    <p className="weather-humidity">Humidity: {weather.humidity}%</p>
    <p className="weather-wind">
      Wind: {weather.windSpeed} {units === "metric" ? "km/h" : "mph"}
    </p>
  </div>
);

export default WeatherCard;
