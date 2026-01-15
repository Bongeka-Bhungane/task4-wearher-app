export interface HourlyForecastItem {
  timestamp: number;
  main: string;
  temperature: number;
  humidity: number;
}

export interface DailyForecastItem {
  date: string;
  main: string;
  maxTemperature: number;
  minTemperature: number;
}

export interface WeatherApiResponse {
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    pressure: number;
    description: string;
  };
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
}

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