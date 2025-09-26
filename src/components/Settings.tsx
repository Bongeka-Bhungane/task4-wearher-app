import React from "react";

interface Props {
  theme: "light" | "dark";
  units: "metric" | "imperial";
  setTheme: (theme: "light" | "dark") => void;
  setUnits: (units: "metric" | "imperial") => void;
}

const Settings: React.FC<Props> = ({ theme, units, setTheme, setUnits }) => (
  <div className="p-4 rounded shadow-lg bg-white/20 mb-4">
    <h3 className="font-bold mb-2">Settings</h3>
    <div className="mb-2">
      <label>Theme:</label>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as "light" | "dark")}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
    <div>
      <label>Units:</label>
      <select
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
