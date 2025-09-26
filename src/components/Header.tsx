import React from "react";
import { Cloud } from "lucide-react";

const Header = () => (
  <header className="flex justify-between items-center mb-4">
    <h1 className="text-3xl font-bold flex items-center">
      <Cloud size={36} className="mr-2" />
      WeatherApp
    </h1>
  </header>
);

export default Header;
