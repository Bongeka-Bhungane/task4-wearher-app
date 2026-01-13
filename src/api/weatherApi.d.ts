export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  minTemperature: number;
  maxTemperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  cloudCoverage: number;
  visibility: number;
  precipitation: number;
  description: string;
  icon: string;
  main: string;
}

export interface HourlyForecastItem {
  timestamp: number;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  main: string;
  precipitation: number;
}

export interface DailyForecastItem {
  date: string;
  minTemperature: number;
  maxTemperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  main: string;
  precipitation: number;
}

export interface ForecastData {
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
}

export interface WeatherData extends ForecastData {
  current: CurrentWeather;
}

export interface LocationData {
  name: string;
  country: string;
}

export interface LocationSearchResult {
  name: string;
  country: string;
  lat: number;
  lon: number;
  state?: string;
}

export declare const weatherApi: {
  getCurrentWeather(
    coords: Coordinates,
    units?: string
  ): Promise<CurrentWeather>;
  getForecast(coords: Coordinates, units?: string): Promise<ForecastData>;
  getWeatherByCoordinates(
    coords: Coordinates,
    units?: string
  ): Promise<WeatherData>;
  getLocationName(coords: Coordinates): Promise<LocationData>;
  searchLocation(query: string): Promise<LocationSearchResult[]>;
};
