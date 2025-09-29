import React from "react";
import type { ForecastData, HourlyForecastData } from "../types";


interface Props {
  daily?: ForecastData[];
  hourly?: HourlyForecastData[];
  view: "daily" | "hourly";
}

const ForecastCard: React.FC<Props> = ({ daily, hourly, view }) => {
  if (view === "daily" && daily)
    return (
      <div className="forecast-grid daily">
        {daily.map((day, i) => (
          <div key={i} className="forecast-item">
            <p>{new Date(day.date).toLocaleDateString()}</p>
            <p>{day.description}</p>
            <p className="forecast-temp">{day.temp}°</p>
          </div>
        ))}
      </div>
    );

  if (view === "hourly" && hourly)
    return (
      <div className="forecast-grid hourly">
        {hourly.map((hour, i) => (
          <div key={i} className="forecast-item">
            <p>{hour.time}</p>
            <p>{hour.description}</p>
            <p className="forecast-temp">{hour.temp}°</p>
          </div>
        ))}
      </div>
    );

  return null;
};

export default ForecastCard;
