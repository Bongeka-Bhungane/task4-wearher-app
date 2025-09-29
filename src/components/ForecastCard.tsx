// ForecastCard.tsx
import React from "react";
import type { ForecastData, HourlyForecastData } from "../types";
import { convertTemperature } from "../api/WeatherApi";

interface Props {
  daily?: (ForecastData & { date?: string })[];
  hourly?: (HourlyForecastData & { date?: string })[];
  view: "daily" | "hourly";
  units: "metric" | "imperial";
}

const ForecastCard: React.FC<Props> = ({ daily, hourly, view, units }) => {
  if (view === "daily" && daily) {
    return (
      <div className="forecast-grid daily">
        {daily.map((day, i) => {
          const dayName = day.date
            ? new Date(day.date).toLocaleDateString(undefined, {
                weekday: "short",
              })
            : "";
          return (
            <div key={i} className="forecast-item">
              {dayName && <p className="forecast-day">{dayName}</p>}
              <p className="forecast-desc">{day.description}</p>
              <p className="forecast-temp">
                {convertTemperature(day.temp, "metric", units).toFixed(1)}°
                {units === "metric" ? "C" : "F"}
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  if (view === "hourly" && hourly) {
    return (
      <div className="forecast-grid hourly">
        {hourly.map((hour, i) => {
          const time = hour.date
            ? new Date(hour.date).toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              })
            : hour.time;
          return (
            <div key={i} className="forecast-item">
              <p className="forecast-day">{time}</p>
              <p className="forecast-desc">{hour.description}</p>
              <p className="forecast-temp">
                {convertTemperature(hour.temp, "metric", units).toFixed(1)}°
                {units === "metric" ? "C" : "F"}
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};

export default ForecastCard;
