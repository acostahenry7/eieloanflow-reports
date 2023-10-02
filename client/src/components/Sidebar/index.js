import React from "react";
import "./index.css";
import { SidebarContext } from "../../contexts/SidebarContext";
import { NavLink } from "react-router-dom";
import { HiOutlineDocumentDuplicate, HiChevronDown } from "react-icons/hi";
import { FaUsersSlash } from "react-icons/fa";

function Sidebar() {
  const { isSidebarOpened } = React.useContext(SidebarContext);

  const [sidebarItems, setSidebarItems] = React.useState([
    {
      label: "Reportes",
      icon: (selected) => (
        <HiOutlineDocumentDuplicate
          className="Sidebar-content-item-icon"
          color={`${selected === true ? "var(--main-color)" : "#888888"}`}
        />
      ),
      route: "/reports",
      selected: false,
      subItems: [
        {
          label: "Clientes en atraso",
          icon: (selected) => (
            <FaUsersSlash
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/arrear-customers",
          selected: false,
        },
      ],
    },
  ]);

  const selectItem = (label) => {
    console.log(label);
    const arr = [...sidebarItems];

    arr.forEach((item) => {
      if (item.label == label) {
        item.selected = !item.selected;
      }

      item.subItems.forEach((subItem) => {
        if (subItem.label == label) {
          subItem.selected = !subItem.selected;
        }
      });
    });

    setSidebarItems(arr);
  };

  return (
    <div className={`Sidebar ${isSidebarOpened ? "opened" : "closed"}`}>
      <div className="Sidebar-content">
        {sidebarItems.map((sbItem) => (
          <div className="Sidebar-content-item">
            <NavLink
              className={`Sidebar-content-item-link ${
                sbItem.selected === true ? "selected" : ""
              }`}
              onClick={(e) => selectItem(e.target.innerText)}
              //   to={sbItem.route}
            >
              {sbItem.icon(sbItem.selected)}
              <span>{sbItem.label}</span>
              {sbItem.subItems.length > 0 && (
                <HiChevronDown
                  className="toggle-icon"
                  size={20}
                  color="#777777"
                />
              )}
            </NavLink>
            {sbItem.subItems.map((item) => (
              <div
                className={`Sidebar-content-subitems ${
                  sbItem.selected ? "opened" : ""
                } `}
              >
                <NavLink
                  className={`Sidebar-content-item-link sublink ${
                    item.selected === true ? "selected" : ""
                  }`}
                  onClick={(e) => selectItem(e.target.innerText)}
                  to={item.route}
                >
                  {item.icon(item.selected)}
                  {item.label}
                </NavLink>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export { Sidebar };