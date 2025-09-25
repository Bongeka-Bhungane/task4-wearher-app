import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

interface CardItem {
  name: string;
  url: string;
  description: string;
  tag: string;
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [links, setLinks] = useState<CardItem[]>([]);
  const [filtered, setFiltered] = useState<CardItem[]>([]);

  // Load saved links once
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("links") || "[]");
    setLinks(stored);
  }, []);

  // Filter only when there is text
  useEffect(() => {
    if (query.trim() === "") {
      setFiltered([]);
      return;
    }

    const lower = query.toLowerCase();
    const results = links.filter(
      (item) =>
        item.name.toLowerCase().includes(lower) ||
        item.url.toLowerCase().includes(lower) ||
        item.description.toLowerCase().includes(lower) ||
        item.tag.toLowerCase().includes(lower)
    );
    setFiltered(results);
  }, [query]);

  return (
    <div className="search-wrapper">
      <div className="search-input-container">
        <input
          type="text"
          placeholder="find link...."
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <FaSearch className="search-icon" />
      </div>

      {query.trim() !== "" && (
        <div className="search-results-window">
          {filtered.length === 0 ? (
            <p>No matches found.</p>
          ) : (
            filtered.map((item, index) => (
              <div key={index} className="search-result">
                <h3>{item.name}</h3>
                <a>
                  <strong>URL:</strong> {item.url}
                </a>
                <p>
                  <strong>Description:</strong> {item.description}
                </p>
                <p>
                  <strong>Tag:</strong> {item.tag}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
