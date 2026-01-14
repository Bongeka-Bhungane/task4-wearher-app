import React from "react";
import "../App.css";

const Spinner: React.FC = () => (
  <div className="spinner-wrapper">
    <div className="spinner" aria-label="Loading" />
  </div>
);

export default Spinner;
