import React from "react";
import "./index.css";
import { SidebarContext } from "../../contexts/SidebarContext";
import { NavLink } from "react-router-dom";
import { HiOutlineDocumentDuplicate, HiChevronDown } from "react-icons/hi";
import { FaUsersSlash } from "react-icons/fa";
import { BiDollar, BiBlock } from "react-icons/bi";
import {
  TbCurrencyDollarOff,
  TbBuildingBank,
  TbCalendarDollar,
  TbClockDollar,
  TbList,
} from "react-icons/tb";
import { FaFileInvoiceDollar, FaHandHoldingDollar } from "react-icons/fa6";

function Sidebar() {
  const { isSidebarOpened } = React.useContext(SidebarContext);

  const [sidebarItems, setSidebarItems] = React.useState([
    {
      label: "Clientes",
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
    {
      label: "Cobros",
      icon: (selected) => (
        <BiDollar
          className="Sidebar-content-item-icon"
          color={`${selected === true ? "var(--main-color)" : "#888888"}`}
        />
      ),
      route: "/reports",
      selected: false,
      subItems: [
        {
          label: "Pagos para hoy",
          icon: (selected) => (
            <BiDollar
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/today-payments",
          selected: false,
        },
        {
          label: "Pagos cancelados",
          icon: (selected) => (
            <TbCurrencyDollarOff
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/canceled-payments",
          selected: false,
        },
        {
          label: "Pagos recibidos",
          icon: (selected) => (
            <FaHandHoldingDollar
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/received-payments",
          selected: false,
        },
        {
          label: "Tendencia de cobros",
          icon: (selected) => (
            <TbCalendarDollar
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/payment-proyection",
          selected: false,
        },
        {
          label: "Histórico control de cobros",
          icon: (selected) => (
            <TbClockDollar
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/payment-control-history",
          selected: false,
        },
      ],
    },
    {
      label: "Préstamos",
      icon: (selected) => (
        <TbBuildingBank
          className="Sidebar-content-item-icon"
          color={`${selected === true ? "var(--main-color)" : "#888888"}`}
        />
      ),
      route: "/reports",
      selected: false,
      subItems: [
        {
          label: "Detalle de préstamo",
          icon: (selected) => (
            <FaFileInvoiceDollar
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/loan-detail",
          selected: false,
        },
      ],
    },
  ]);

  const selectItem = (label) => {
    const arr = [...sidebarItems];

    arr.forEach((item) => {
      if (item.label == label) {
        item.selected = !item.selected;
      }

      item.subItems.forEach((subItem) => {
        if (subItem.label == label) {
          subItem.selected = true;
        } else {
          subItem.selected = false;
        }
      });
    });

    setSidebarItems(arr);
  };

  return (
    <div className={`Sidebar ${isSidebarOpened ? "opened" : "closed"}`}>
      <div className="Sidebar-content">
        {sidebarItems.map((sbItem, index) => (
          <div key={index} className="Sidebar-content-item">
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
            {sbItem.subItems.map((item, index) => (
              <div
                key={index}
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
