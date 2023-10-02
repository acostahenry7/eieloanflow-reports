import React from "react";
import "./index.css";
import { AuthContext } from "../../contexts/AuthContext";
import { SidebarContext } from "../../contexts/SidebarContext";
import logo from "../../media/logo-fianance.png";
import { FaAngleLeft } from "react-icons/fa";

function TopNavbar() {
  const { auth, logout } = React.useContext(AuthContext);
  const { isSidebarOpened, setIsSidebarOpened } =
    React.useContext(SidebarContext);

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
        <span onClick={() => logout()}>{auth.login}</span>
      </div>
    </div>
  );
}

export { TopNavbar };
