import React from "react";
import type { Location } from "../types";

interface Props {
  locations: Location[];
  onSelect: (loc: Location) => void;
  onRemove: (name: string) => void;
}

const SavedLocations: React.FC<Props> = ({ locations, onSelect, onRemove }) => (
  <div className="mt-4 p-4 rounded shadow-lg bg-white/20">
    <h3 className="font-bold mb-2">Saved Locations</h3>
    {locations.length === 0 && <p>No saved locations</p>}
    {locations.map((loc, i) => (
      <div key={i} className="flex justify-between mb-2 cursor-pointer">
        <span onClick={() => onSelect(loc)}>{loc.name}</span>
        <button onClick={() => onRemove(loc.name)}>Remove</button>
      </div>
    ))}
  </div>
);

export default SavedLocations;
