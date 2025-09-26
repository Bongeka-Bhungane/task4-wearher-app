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
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-4">
        {daily.map((day, i) => (
          <div key={i} className="p-2 rounded bg-white/10 text-center">
            <p>{new Date(day.date).toLocaleDateString()}</p>
            <p>{day.description}</p>
            <p className="font-bold">{day.temp}°</p>
          </div>
        ))}
      </div>
    );

  if (view === "hourly" && hourly)
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-4">
        {hourly.map((hour, i) => (
          <div key={i} className="p-2 rounded bg-white/10 text-center">
            <p>{hour.time}</p>
            <p>{hour.description}</p>
            <p className="font-bold">{hour.temp}°</p>
          </div>
        ))}
      </div>
    );

  return null;
};

export default ForecastCard;
