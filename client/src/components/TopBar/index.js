import React from "react";
import "./index.css";

function TopBar({ title }) {
  return (
    <div className="TopBar">
      <h3>{title}</h3>
      <span>Reportes / </span> <span>{title}</span>
    </div>
  );
}

export { TopBar };
