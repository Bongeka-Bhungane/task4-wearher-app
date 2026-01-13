const API_KEY = "065c10a16f50b9dd81c688ddae060222";
const BASE_URL = "https://api.openweathermap.org";

export const weatherApi = {
  async getCurrentWeather(coords, units = "metric") {
    const res = await fetch(
      `${BASE_URL}/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${API_KEY}&units=${units}`
    );

    if (!res.ok) throw new Error("Failed to fetch weather");
    const data = await res.json();

    return {
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      minTemperature: data.main.temp_min,
      maxTemperature: data.main.temp_max,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      windDirection: data.wind.deg,
      cloudCoverage: data.clouds.all,
      visibility: data.visibility,
      precipitation: 0,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      main: data.weather[0].main,
    };
  },

  async getForecast(coords, units = "metric") {
    const res = await fetch(
      `${BASE_URL}/data/2.5/forecast?lat=${coords.latitude}&lon=${coords.longitude}&appid=${API_KEY}&units=${units}`
    );

    if (!res.ok) throw new Error("Failed to fetch forecast");
    const data = await res.json();

    const hourly = data.list.slice(0, 24).map((item) => ({
      timestamp: item.dt,
      temperature: item.main.temp,
      feelsLike: item.main.feels_like,
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      main: item.weather[0].main,
      precipitation: item.rain?.["3h"] || 0,
    }));

    const dailyMap = {};
    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toDateString();
      dailyMap[date] ??= [];
      dailyMap[date].push(item);
    });

    const daily = Object.entries(dailyMap)
      .slice(0, 7)
      .map(([date, items]) => {
        const temps = items.map((i) => i.main.temp);
        const mid = items[Math.floor(items.length / 2)];

        return {
          date,
          minTemperature: Math.min(...temps),
          maxTemperature: Math.max(...temps),
          humidity: mid.main.humidity,
          windSpeed: mid.wind.speed,
          description: mid.weather[0].description,
          icon: mid.weather[0].icon,
          main: mid.weather[0].main,
          precipitation: items.reduce(
            (sum, i) => sum + (i.rain?.["3h"] || 0),
            0
          ),
        };
      });

    return { hourly, daily };
  },

  async getWeatherByCoordinates(coords, units) {
    const current = await this.getCurrentWeather(coords, units);
    const forecast = await this.getForecast(coords, units);
    return { current, ...forecast };
  },

  async getLocationName(coords) {
    const res = await fetch(
      `${BASE_URL}/geo/1.0/reverse?lat=${coords.latitude}&lon=${coords.longitude}&limit=1&appid=${API_KEY}`
    );

    const data = await res.json();
    return data.length
      ? { name: data[0].name, country: data[0].country }
      : { name: "Unknown", country: "Unknown" };
  },

  async searchLocation(query) {
    const res = await fetch(
      `${BASE_URL}/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
    );
    return res.json();
  },
};
