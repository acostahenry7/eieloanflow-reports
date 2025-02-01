import React from "react";

const FilterItem = ({ label, name, onChange }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <input
        type="checkbox"
        id={`${name.toLowerCase()}`}
        // checked={seeDisbursement}
        onChange={onChange}
        style={{
          cursor: "pointer",
          width: 22,
          height: 22,
        }}
      />
      <label style={{ cursor: "pointer" }} htmlFor={`${name.toLowerCase()}`}>
        {label}
      </label>
    </div>
  );
};

export default FilterItem;
