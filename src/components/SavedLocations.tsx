import React from "react";
import type { Location } from "../types";

interface Props {
  locations: Location[];
  onSelect: (loc: Location) => void;
  onRemove: (name: string) => void;
}

const SavedLocations: React.FC<Props> = ({ locations, onSelect, onRemove }) => (
  <div className="saved-locations">
    <h3>Saved Locations</h3>
    {locations.length === 0 && (
      <p className="no-locations">No saved locations</p>
    )}
    {locations.map((loc, i) => (
      <div key={i} className="saved-location">
        <span onClick={() => onSelect(loc)} className="location-name">
          {loc.name}
        </span>
        <button onClick={() => onRemove(loc.name)} className="remove-btn">
          Remove
        </button>
      </div>
    ))}
  </div>
);

export default SavedLocations;
