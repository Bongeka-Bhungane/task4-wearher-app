import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import Spinner from "./Spinner";
import { weatherApi } from "../api/weatherApi";
import { cacheManager } from "../utils/cacheManager";
import type { Location, Coordinates } from "../types";

type Props = {
  onSelect: (coords: Coordinates) => void;
};

export default function LocationSearch({ onSelect }: Props) {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);

  useEffect(() => {
    const saved = cacheManager.getPreferences("savedLocations");
    if (saved) {
      setSavedLocations(
        typeof saved === "string" ? JSON.parse(saved) : saved
      );
    }
  }, []);

  const search = async (e: FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    const res: Location[] = await weatherApi.searchLocation(query);
    setResults(res);
    setLoading(false);
  };

  const handleSelect = (result: Location) => {
    onSelect({ latitude: result.lat, longitude: result.lon });
    setQuery("");
    setResults([]);
  };

  const addSavedLocation = (result: Location) => {
    const exists = savedLocations.some(
      (l) => l.lat === result.lat && l.lon === result.lon
    );

    if (!exists) {
      const updated = [...savedLocations, result];
      setSavedLocations(updated);
      cacheManager.setPreferences("savedLocations", JSON.stringify(updated));
    }

    handleSelect(result);
  };

   const removeSavedLocation = (lat: number, lon: number) => {
     const updated = savedLocations.filter(
       (l) => !(l.lat === lat && l.lon === lon)
     );
     setSavedLocations(updated);
     cacheManager.setPreferences("savedLocations", JSON.stringify(updated));
   };

  return (
    <div className="search card" style={{ marginBottom: "1.5rem" }}>
      {savedLocations.length > 0 && (
        <div className="saved-locations">
          <h3>Saved Locations</h3>
          <div className="locations">
            {savedLocations.map((loc) => (
              <div className="saved-location" key={`${loc.lat}-${loc.lon}`}>
                <span
                  className="location-name"
                  onClick={() => handleSelect(loc)}
                >
                  ⭐ {loc.name}, {loc.country}
                </span>
                <button
                  className="remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSavedLocation(loc.lat, loc.lon);
                  }}
                  title="Remove"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <form
        onSubmit={search}
        style={{
          display: "flex",
          gap: "0.7rem",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          autoComplete="off"
          style={{
            padding: "0.7rem 1.1rem",
            fontSize: "1.08rem",
            borderRadius: "8px",
            border: "1.5px solid #e0e7ef",
            background: "#f8fafc",
            outline: "none",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            flex: 1,
            transition: "border 0.18s, box-shadow 0.18s",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.7rem 1.3rem",
            borderRadius: "8px",
            border: "none",
            background: "#2563eb",
            color: "#fff",
            fontWeight: 600,
            fontSize: "1.08rem",
            cursor: "pointer",
            boxShadow: "0 1px 4px rgba(37,99,235,0.08)",
            transition: "background 0.18s, color 0.18s, box-shadow 0.18s",
          }}
        >
          Search
        </button>
      </form>

      {loading && <Spinner />}

      {results.length > 0 && (
        <div className="search-results">
          {results.map((r) => (
            <div
              key={`${r.lat}-${r.lon}`}
              style={{
                display: "flex",
                gap: "0.5rem",
                marginBottom: "0.25rem",
                alignItems: "center",
              }}
            >
              <button
                onClick={() => handleSelect(r)}
                style={{
                  flex: 1,
                  textAlign: "left",
                  borderRadius: "7px",
                  padding: "0.7em 1em",
                  background: "#e0e7ef",
                  border: "none",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                {r.name}, {r.country}
                {r.state && ` - ${r.state}`}
              </button>
              <button
                onClick={() => addSavedLocation(r)}
                style={{
                  whiteSpace: "nowrap",
                  padding: "0.6em 0.9em",
                  fontSize: "1rem",
                  borderRadius: "7px",
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  fontWeight: 600,
                  cursor: "pointer",
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
