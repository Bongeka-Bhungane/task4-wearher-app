import type {
  WeatherData,
  HourlyWeather,
  DailyWeather,
  WeatherMain,
} from "../types";
import type { WeatherApiResponse } from "../api/weatherApi";

const isWeatherMain = (value: string): value is WeatherMain => {
  return [
    "Clear",
    "Clouds",
    "Rain",
    "Drizzle",
    "Thunderstorm",
    "Snow",
    "Mist",
    "Smoke",
    "Haze",
    "Dust",
    "Fog",
    "Sand",
    "Ash",
    "Squall",
    "Tornado",
  ].includes(value);
};

export const mapWeatherApiToUi = (api: WeatherApiResponse): WeatherData => ({
  current: api.current,
  hourly: api.hourly.map(
    (h): HourlyWeather => ({
      timestamp: h.timestamp,
      main: isWeatherMain(h.main) ? h.main : "Clear",
      temperature: h.temperature,
      humidity: h.humidity,
    })
  ),
  daily: api.daily.map(
    (d): DailyWeather => ({
      date: d.date,
      main: isWeatherMain(d.main) ? d.main : "Clear",
      maxTemperature: d.maxTemperature,
      minTemperature: d.minTemperature,
    })
  ),
});
