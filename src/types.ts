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
  icon?: string;
}

export interface ForecastData {
  date: string;
  temp: number; 
  tempMax?: number; 
  tempMin?: number; 
  description: string;
  weatherCode: number;
  humidity?: number;
  windSpeed?: number;
}


export interface HourlyForecastData {
  date: string;
  time: string;
  temp: number; 
  description: string;
  weatherCode: number;
  humidity?: number;
  windSpeed?: number;
}



export interface ApiDaily {
  dt: number;
  temp: { day: number };
  weather: { description: string; icon: string }[];
}

export interface ApiHourly {
  dt: number;
  temp: number;
  weather: { description: string; icon: string }[];
}

interface HourlyForecastItem {
  dt_txt: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}
