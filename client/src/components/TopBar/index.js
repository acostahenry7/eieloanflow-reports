import React from "react";
import "./index.css";

function TopBar({ title, buttonTitle, btnOnClick }) {
  return (
    <div className="TopBar">
      <div>
        <h3>{title}</h3>
        <span>Reportes / </span> <span>{title}</span>
      </div>
      {buttonTitle && (
        <button onClick={btnOnClick}>{buttonTitle || "Button"}</button>
      )}
    </div>
  );
}

export { TopBar };
