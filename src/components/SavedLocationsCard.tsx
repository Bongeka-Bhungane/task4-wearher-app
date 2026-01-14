import React from "react";
import type { Location } from "../types";
import "../App.css";

interface Props {
  locations: Location[];
  onSelect: (loc: Location) => void;
  onRemove: (name: string) => void;
}

const SavedLocationsCard: React.FC<Props> = ({
  locations,
  onSelect,
  onRemove,
}) => (
  <div className="saved-locations card">
    <h3>Saved Locations</h3>
    {locations.length === 0 ? (
      <div className="no-locations">No saved locations yet.</div>
    ) : (
      locations.map((loc) => (
        <div className="saved-location" key={loc.name}>
          <span className="location-name" onClick={() => onSelect(loc)}>
            {loc.name}
          </span>
          <button
            className="remove-btn"
            onClick={() => onRemove(loc.name)}
            title="Remove"
          >
            &times;
          </button>
        </div>
      ))
    )}
  </div>
);

export default SavedLocationsCard;
