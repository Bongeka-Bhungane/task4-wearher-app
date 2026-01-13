import { useState, useEffect } from "react";
import { weatherApi } from "../api/weatherApi";
import { cacheManager } from "../utils/cacheManager";

export default function LocationSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [savedLocations, setSavedLocations] = useState([]);

  useEffect(() => {
    const saved = cacheManager.getPreferences("savedLocations");
    if (saved) {
      setSavedLocations(JSON.parse(saved));
    }
  }, []);

  const search = async (e) => {
    e.preventDefault();
    if (!query) return;

    const res = await weatherApi.searchLocation(query);
    setResults(res);
  };

  const handleSelect = (result) => {
    onSelect({ latitude: result.lat, longitude: result.lon });
    setQuery("");
    setResults([]);
  };

  const addSavedLocation = (result) => {
    const newLocation = {
      name: result.name,
      country: result.country,
      lat: result.lat,
      lon: result.lon,
    };

    const locationExists = savedLocations.some(
      (loc) => loc.lat === result.lat && loc.lon === result.lon
    );

    if (!locationExists) {
      const updated = [...savedLocations, newLocation];
      setSavedLocations(updated);
      cacheManager.setPreferences("savedLocations", JSON.stringify(updated));
    }

    handleSelect(result);
  };

  const removeSavedLocation = (lat, lon) => {
    const updated = savedLocations.filter(
      (loc) => !(loc.lat === lat && loc.lon === lon)
    );
    setSavedLocations(updated);
    cacheManager.setPreferences("savedLocations", JSON.stringify(updated));
  };

  return (
    <div className="search">
      {savedLocations.length > 0 && (
        <div className="saved-locations">
          {savedLocations.map((loc) => (
            <button
              key={`${loc.lat}-${loc.lon}`}
              onClick={() => handleSelect(loc)}
              style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
            >
              ⭐ {loc.name}, {loc.country}
              <button
                className="remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSavedLocation(loc.lat, loc.lon);
                }}
              >
                ✕
              </button>
            </button>
          ))}
        </div>
      )}

      <form onSubmit={search}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          autoComplete="off"
        />
        <button type="submit" style={{ whiteSpace: "nowrap" }}>
          Search
        </button>
      </form>

      {results.length > 0 && (
        <div className="search-results">
          {results.map((r) => (
            <div
              key={`${r.lat}-${r.lon}`}
              style={{
                display: "flex",
                gap: "0.5rem",
                marginBottom: "0.25rem",
              }}
            >
              <button
                onClick={() => handleSelect(r)}
                style={{ flex: 1, textAlign: "left" }}
              >
                {r.name}, {r.country}
                {r.state && ` - ${r.state}`}
              </button>
              <button
                onClick={() => addSavedLocation(r)}
                style={{
                  whiteSpace: "nowrap",
                  padding: "0.6em 0.75em",
                  fontSize: "0.9rem",
                }}
              >
                ⭐ Save
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
