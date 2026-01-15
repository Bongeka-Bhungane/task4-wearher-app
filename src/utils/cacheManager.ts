const CACHE_PREFIX = "weather_cache_";
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

type CachedItem<T> = {
  data: T;
  timestamp: number;
};

export const cacheManager = {
  setWeatherCache<T>(key: string, data: T): void {
    const cache: CachedItem<T> = {
      data,
      timestamp: Date.now(),
    };

    try {
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cache));
    } catch (error) {
      console.error("Cache write error:", error);
    }
  },

  getWeatherCache<T>(key: string): T | null {
    try {
      const cached = localStorage.getItem(CACHE_PREFIX + key);
      if (!cached) return null;

      const parsed: CachedItem<T> = JSON.parse(cached);

      if (Date.now() - parsed.timestamp > CACHE_DURATION) {
        localStorage.removeItem(CACHE_PREFIX + key);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.error("Cache read error:", error);
      return null;
    }
  },

  setPreferences<T>(key: string, data: T): void {
    try {
      localStorage.setItem(`prefs_${key}`, JSON.stringify(data));
    } catch (error) {
      console.error("Preference write error:", error);
    }
  },

  getPreferences<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(`prefs_${key}`);
      return data ? (JSON.parse(data) as T) : null;
    } catch (error) {
      console.error("Preference read error:", error);
      return null;
    }
  },
};
