// types.ts
export interface Location {
  name: string;
  lat: number;
  lon: number;
  isCurrentLocation?: boolean; 
}

export interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface ForecastData {
  date: string;
  temp: number;
  description: string;
  icon: string;
}

export interface HourlyForecastData {
  time: string;
  temp: number;
  description: string;
  icon: string;
}
