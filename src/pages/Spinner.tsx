import React from "react";
import "./Spinner.module.css"; // Add spinner styles

const Spinner: React.FC = () => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
    </div>
  );
};

export default Spinner;
