import type { WeatherData, ForecastData, Location } from "../types";

const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY"; // store in .env for real projects

export const fetchCurrentWeather = async (
  location: Location,
  units = "metric"
): Promise<WeatherData> => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=${units}&appid=${API_KEY}`
  );
  const data = await res.json();
  return {
    temperature: Math.round(data.main.temp),
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    icon: data.weather[0].icon,
  };
};

interface ForecastItem {
  dt_txt: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

export const fetchForecast = async (
  location: Location,
  units = "metric"
): Promise<ForecastData[]> => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&units=${units}&appid=${API_KEY}`
  );
  const data = await res.json();
  return data.list.slice(0, 5).map((item: ForecastItem) => ({
    date: item.dt_txt,
    temp: Math.round(item.main.temp),
    description: item.weather[0].description,
    icon: item.weather[0].icon,
  }));
};

export const fetchHourlyForecast = async (
  location: Location,
  units = "metric"
): Promise<HourlyForecastData[]> => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&units=${units}&appid=${API_KEY}`
  );
  const data = await res.json();
  // Return hourly forecasts for next 8 periods (~24h)
  return data.list.slice(0, 8).map((item: any) => ({
    time: item.dt_txt.split(" ")[1].slice(0, 5),
    temp: Math.round(item.main.temp),
    description: item.weather[0].description,
    icon: item.weather[0].icon,
  }));
};
