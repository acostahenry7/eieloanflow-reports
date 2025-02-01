import { Popover } from "@mui/material";
import React from "react";

import { BsThreeDots } from "react-icons/bs";

function PopoverMenu({ options }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  return (
    <>
      <BsThreeDots
        title="Mostrar / ocultar columnas"
        className="SearchBar-actions-icon"
        aria-describedby={"filter-pop"}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      />
      <Popover
        id={"filter-pop"}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {options?.map((opt) => (
            <li
              className="search-bar-filter-list-item"
              style={{
                cursor: "pointer",
                width: "max-content",
                padding: "8px 10px",
              }}
              onClick={() => opt.action(setAnchorEl)}
            >
              {opt.icon}
              <span style={{ marginLeft: 10, cursor: "pointer" }}>
                {opt.name}
              </span>
            </li>
          ))}
        </ul>
      </Popover>
    </>
  );
}

export default PopoverMenu;
