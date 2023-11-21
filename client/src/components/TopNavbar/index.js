import React from "react";
import "./index.css";
import { AuthContext } from "../../contexts/AuthContext";
import { SidebarContext } from "../../contexts/SidebarContext";
import logo from "../../media/logo-fianance.png";
import { FaAngleLeft } from "react-icons/fa";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

function TopNavbar() {
  const { auth, logout } = React.useContext(AuthContext);
  const { isSidebarOpened, setIsSidebarOpened } =
    React.useContext(SidebarContext);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className="TopNavbar">
      <div className="TopNavbar-logo">
        <a href="/">
          <img src={logo} alt="hola" />
        </a>

        <div className="TopNavbar-toggle">
          <FaAngleLeft
            onClick={() => setIsSidebarOpened(!isSidebarOpened)}
            className={`TopNavbar-toggle-icon ${
              isSidebarOpened ? "opened" : "closed"
            }`}
            size={32}
          />
        </div>
      </div>
      <div className="TopNavbar-options">
        <p style={{ cursor: "pointer" }} onClick={handleClick}>
          {auth.login}
        </p>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          {/* <Typography sx={{ p: 2 }}>{auth.login}</Typography> */}
          <Typography
            style={{ cursor: "pointer" }}
            onClick={() => {
              logout();
            }}
            sx={{ p: 2 }}
          >
            Logout
          </Typography>
        </Popover>

        {/* <span onClick={() => logout()}>
          {auth.login}
          
          </span> */}
      </div>
    </div>
  );
}

export { TopNavbar };
