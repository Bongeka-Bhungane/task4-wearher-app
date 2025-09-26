import React from "react";
import type { ForecastData } from "../types";

interface Props {
  forecast: ForecastData[];
}

const ForecastCard: React.FC<Props> = ({ forecast }) => (
  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mt-4">
    {forecast.map((day, i) => (
      <div key={i} className="p-2 rounded bg-white/10 text-center">
        <p>{new Date(day.date).toLocaleDateString()}</p>
        <p>{day.description}</p>
        <p className="font-bold">{day.temp}°</p>
      </div>
    ))}
  </div>
);

export default ForecastCard;
