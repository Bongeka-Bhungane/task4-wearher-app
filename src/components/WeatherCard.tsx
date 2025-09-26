import React from "react";
import type { WeatherData } from "../types";

interface Props {
  weather: WeatherData;
  units: "metric" | "imperial";
}

const WeatherCard: React.FC<Props> = ({ weather, units }) => (
  <div className="p-4 rounded shadow-lg bg-white/20">
    <h2 className="text-xl font-bold">{weather.description}</h2>
    <p className="text-4xl">
      {weather.temperature}°{units === "metric" ? "C" : "F"}
    </p>
    <p>Humidity: {weather.humidity}%</p>
    <p>
      Wind: {weather.windSpeed} {units === "metric" ? "km/h" : "mph"}
    </p>
  </div>
);

export default WeatherCard;
