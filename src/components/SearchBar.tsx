import React, { useState } from "react";
import { Search } from "lucide-react";
import type { Location } from "../types";

interface Props {
  onSearch: (location: Location) => void;
}

const SearchBar: React.FC<Props> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return;
    // Simple mock geocoding (replace with API if needed)
    const location: Location = { name: query, lat: 0, lon: 0 };
    onSearch(location);
    setQuery("");
  };

  return (
    <div className="relative">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        placeholder="Search for a city..."
        className="px-4 py-2 rounded w-full"
      />
      <Search
        size={20}
        className="absolute right-2 top-2 cursor-pointer"
        onClick={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
