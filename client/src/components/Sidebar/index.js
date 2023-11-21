import React from "react";
import "./index.css";
import { SidebarContext } from "../../contexts/SidebarContext";
import { NavLink } from "react-router-dom";
import {
  HiOutlineDocumentDuplicate,
  HiChevronDown,
  HiOutlineCalculator,
} from "react-icons/hi";
import { FaUsersSlash, FaCalculator, FaChartBar } from "react-icons/fa";
import { BiDollar, BiBlock } from "react-icons/bi";
import { AiOutlineAudit, AiTwotoneBank } from "react-icons/ai";
import {
  TbCurrencyDollarOff,
  TbBuildingBank,
  TbCalendarDollar,
  TbClockDollar,
  TbList,
} from "react-icons/tb";
import {
  FaFileInvoiceDollar,
  FaHandHoldingDollar,
  FaMotorcycle,
} from "react-icons/fa6";
import { BsFolderCheck } from "react-icons/bs";
import { MdInsertChart, MdOutlineBalance } from "react-icons/md";
import { IoDocumentAttachSharp } from "react-icons/io5";

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
          label: "Cierre de caja",
          icon: (selected) => (
            <BsFolderCheck
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/register-close",
          selected: false,
        },
        {
          label: "Pagos pendientes",
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
        {
          label: "Visitas a clientes",
          icon: (selected) => (
            <FaMotorcycle
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/payment-visits",
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
        {
          label: "Acciones al préstamo",
          icon: (selected) => (
            <AiOutlineAudit
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/loan-activities",
          selected: false,
        },
        {
          label: "Descuentos a préstamos",
          icon: (selected) => (
            <AiOutlineAudit
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/loan-discounts",
          selected: false,
        },
        {
          label: "Solicitudes de préstamos",
          icon: (selected) => (
            <IoDocumentAttachSharp
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/loan-request",
          selected: false,
        },
      ],
    },
    {
      label: "Contabilidad",
      icon: (selected) => (
        <HiOutlineCalculator
          className="Sidebar-content-item-icon"
          color={`${selected === true ? "var(--main-color)" : "#888888"}`}
        />
      ),
      route: "/accounting",
      selected: false,
      subItems: [
        {
          label: "Balance General",
          icon: (selected) => (
            <FaChartBar
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/accounting-general-balance",
          selected: true,
        },
        {
          label: "Estado de Resultado",
          icon: (selected) => (
            <MdInsertChart
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/accounting-result-status",
          selected: false,
        },

        {
          label: "Balanza de comprobación",
          icon: (selected) => (
            <MdOutlineBalance
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/accouting-validation-balance",
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
              onClick={(e) => selectItem(sbItem.label)}
              //   to={sbItem.route}
            >
              {sbItem.icon(sbItem.selected)}
              <div
                style={{
                  width: "100%",
                  display: "flex",
                }}
              >
                <span>
                  {sbItem.label} - {`(${sbItem.subItems.length})`}
                </span>
              </div>
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
