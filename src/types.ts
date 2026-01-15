export type TemperatureUnit = "C" | "F";

export type WeatherMain =
  | "Clear"
  | "Clouds"
  | "Rain"
  | "Drizzle"
  | "Thunderstorm"
  | "Snow"
  | "Mist"
  | "Smoke"
  | "Haze"
  | "Dust"
  | "Fog"
  | "Sand"
  | "Ash"
  | "Squall"
  | "Tornado";

export interface DailyWeather {
  date: string;
  main: WeatherMain;
  maxTemperature: number;
  minTemperature: number;
}

export interface HourlyWeather {
  timestamp: number;
  main: WeatherMain;
  temperature: number;
  humidity: number;
}

export interface WeatherData {
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    pressure: number;
    description: string;
  };
  hourly: HourlyWeather[];
  daily: DailyWeather[];
}

export interface Location {
  name: string;
  country: string;
  lat: number;
  lon: number;
  state?: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}
