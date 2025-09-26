import React from "react";

interface Props {
  theme: "light" | "dark";
  units: "metric" | "imperial";
  setTheme: (theme: "light" | "dark") => void;
  setUnits: (units: "metric" | "imperial") => void;
}

const Settings: React.FC<Props> = ({ theme, units, setTheme, setUnits }) => (
  <div className="settings-panel">
    <h3>Settings</h3>
    <div className="setting-item">
      <label htmlFor="theme-select">Theme:</label>
      <select
        id="theme-select"
        value={theme}
        onChange={(e) => setTheme(e.target.value as "light" | "dark")}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
    <div className="setting-item">
      <label htmlFor="units-select">Units:</label>
      <select
        id="units-select"
        value={units}
        onChange={(e) => setUnits(e.target.value as "metric" | "imperial")}
      >
        <option value="metric">Celsius</option>
        <option value="imperial">Fahrenheit</option>
      </select>
    </div>
  </div>
);

export default Settings;
