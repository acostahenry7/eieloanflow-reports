import React from "react";
import "./index.css";

function TopBar({ title, buttonTitle, btnOnClick, isConciliation, onManual }) {
  return (
    <div className="TopBar">
      <div>
        <h3>{title}</h3>
        <span>Reportes / </span> <span>{title}</span>
      </div>
      <div
        style={{ height: 50, display: "flex", gap: 12, alignItems: "center" }}
      >
        <div>
          {isConciliation && (
            <input id="manual" type="checkbox" onChange={onManual} />
          )}
          <label htmlFor="manual">Manual</label>
        </div>

        {buttonTitle && (
          <button style={{ height: 40 }} onClick={btnOnClick}>
            {buttonTitle || "Button"}
          </button>
        )}
      </div>
    </div>
  );
}

export { TopBar };
