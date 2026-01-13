const CACHE_PREFIX = "weather_cache_";
const CACHE_DURATION = 30 * 60 * 1000;

export const cacheManager = {
  setWeatherCache(key, data) {
    localStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({ data, timestamp: Date.now() })
    );
  },

  getWeatherCache(key) {
    const cached = localStorage.getItem(CACHE_PREFIX + key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return data;
  },

  setPreferences(key, data) {
    localStorage.setItem(`prefs_${key}`, JSON.stringify(data));
  },

  getPreferences(key) {
    const data = localStorage.getItem(`prefs_${key}`);
    return data ? JSON.parse(data) : null;
  },
};
