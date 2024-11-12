import React from "react";
import { SidebarContext } from "../../contexts/SidebarContext";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import {
  HiOutlineDocumentDuplicate,
  HiChevronDown,
  HiOutlineCalculator,
} from "react-icons/hi";
import {
  FaUsersSlash,
  FaCalculator,
  FaChartBar,
  FaUser,
  FaUsers,
  FaCoins,
} from "react-icons/fa";
import { BiDollar, BiSolidDashboard } from "react-icons/bi";
import { AiOutlineAudit, AiTwotoneBank } from "react-icons/ai";
import {
  TbCurrencyDollarOff,
  TbBuildingBank,
  TbCalendarDollar,
  TbClockDollar,
  TbList,
  TbDatabaseDollar,
  TbReportSearch,
  TbReport,
  TbTableDown,
} from "react-icons/tb";
import {
  FaFileInvoiceDollar,
  FaHandHoldingDollar,
  FaMotorcycle,
  FaMoneyBillTransfer,
} from "react-icons/fa6";
import { BsFolderCheck } from "react-icons/bs";
import { MdInsertChart, MdOutlineBalance } from "react-icons/md";
import { IoReceiptOutline } from "react-icons/io5";
import { RiFileExcel2Line } from "react-icons/ri";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import "./index.css";

function Sidebar() {
  const { isSidebarOpened } = React.useContext(SidebarContext);
  const { auth } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarItems, setSidebarItems] = React.useState([
    {
      label: "Dashboards",
      icon: (selected) => (
        <BiSolidDashboard
          className="Sidebar-content-item-icon"
          color={`${selected === true ? "var(--main-color)" : "#888888"}`}
        />
      ),
      selected: false,
      subItems: [
        {
          privilege: "DASHBOARD_LOAN_APPLICATION",
          label: "- Solicitudes",
          icon: (selected) => (
            <HiOutlineDocumentText
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/dash/loan-requests",
          selected: false,
        },
        {
          label: "- Préstamos",
          icon: (selected) => (
            <TbBuildingBank
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/dash/loan",
          selected: false,
        },

        {
          label: "- Contabilidad",
          icon: (selected) => (
            <HiOutlineCalculator
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/dash/accounting",
          selected: false,
        },
        {
          label: "- Cobros",
          icon: (selected) => (
            <TbBuildingBank
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/dash/payments",
          selected: false,
        },
      ],
    },
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
          privilege: "",
          label: "Clientes (prestamos)",
          icon: (selected) => (
            <FaUsers
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/customer-loan",
          selected: false,
        },
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
          privilege: "",
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
          label: "Condensado de caja",
          icon: (selected) => (
            <TbReport
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/grouped-register-close",
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
        {
          label: "Mora Pagada",
          icon: (selected) => (
            <TbDatabaseDollar
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/paid-mora",
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
          privilege: "",
          label: "Solicitudes de préstamos",
          icon: (selected) => (
            <HiOutlineDocumentText
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/loan-application",
          selected: false,
        },
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
          label: "Datacrédito",
          icon: (selected) => (
            <RiFileExcel2Line
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/datacredit",
          selected: false,
        },
        {
          label: "Movimiento en el préstamo",
          icon: (selected) => (
            <FaMoneyBillTransfer
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/loan-movement",
          selected: false,
        },
        {
          label: "Tabla de amortización",
          icon: (selected) => (
            <TbTableDown
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/loan-amortization",
          selected: false,
        },
        // {
        //   label: "Solicitudes de préstamos",
        //   icon: (selected) => (
        //     <IoDocumentAttachSharp
        //       className="Sidebar-content-item-icon"
        //       color={`${selected === true ? "var(--main-color)" : "#888888"}`}
        //     />
        //   ),
        //   route: "/reports/loan-request",
        //   selected: false,
        // },
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
          privilege: "",
          label: "Catálogo de cuentas",
          icon: (selected) => (
            <FaChartBar
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/accounting-catalog",
          selected: true,
        },
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
          label: "Cuentas por pagar",
          icon: (selected) => (
            <GiPayMoney
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/accounting-account-payable",
          selected: false,
        },
        {
          label: "Cuentas por cobrar",
          icon: (selected) => (
            <GiReceiveMoney
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/charge-account",
          selected: false,
        },
        {
          label: "Intereses cobrados",
          icon: (selected) => (
            <GiReceiveMoney
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/paid-interest",
          selected: false,
        },
        {
          label: "Recibos de Ingreso (NCF)",
          icon: (selected) => (
            <IoReceiptOutline
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/receipt-detail",
          selected: false,
        },
        // {
        //   label: "Intereses Cobrados",
        //   icon: (selected) => (
        //     <FaCoins
        //       className="Sidebar-content-item-icon"
        //       color={`${selected === true ? "var(--main-color)" : "#888888"}`}
        //     />
        //   ),
        //   route: "/reports/charge-account",
        //   selected: false,
        // },
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
        //60X
        {
          label: "Formulario 606",
          icon: (selected) => (
            <RiFileExcel2Line
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/accouting-606",
          selected: false,
        },
        {
          label: "Formulario 607",
          icon: (selected) => (
            <RiFileExcel2Line
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/accouting-607",
          selected: false,
        },
        // {
        //   label: "Formulario 608",
        //   icon: (selected) => (
        //     <TbReport
        //       className="Sidebar-content-item-icon"
        //       color={`${selected === true ? "var(--main-color)" : "#888888"}`}
        //     />
        //   ),
        //   route: "/reports/accouting-607",
        //   selected: false,
        // },
        // {
        //   label: "Formulario 623",
        //   icon: (selected) => (
        //     <TbReport
        //       className="Sidebar-content-item-icon"
        //       color={`${selected === true ? "var(--main-color)" : "#888888"}`}
        //     />
        //   ),
        //   route: "/reports/accouting-607",
        //   selected: false,
        // },
        {
          label: "Mayor General",
          icon: (selected) => (
            <TbReport
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/accouting-major-general",
          selected: false,
        },
        {
          label: "Mayor General Detallado",
          icon: (selected) => (
            <TbReport
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/detailed-accouting-major-general",
          selected: false,
        },
        {
          label: "Conciliación bancaria",
          icon: (selected) => (
            <MdInsertChart
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/accounting-conciliation",
          selected: false,
        },
        {
          label: "Mayor Caja (cajeros)",
          icon: (selected) => (
            <TbReport
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/accounting-box-major",
          selected: false,
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
      ],
    },
    {
      label: "Recursos Humanos",
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
          privilege: "EMPLOYEES",
          label: "Empleados",
          icon: (selected) => (
            <FaUsers
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/rrhh-employees",
          selected: false,
        },
        {
          privilege: "PAYROLLS",
          label: "Reporte comisión cobrador",
          icon: (selected) => (
            <FaChartBar
              className="Sidebar-content-item-icon"
              color={`${selected === true ? "var(--main-color)" : "#888888"}`}
            />
          ),
          route: "/reports/rrhh-collector-commission",
          selected: false,
        },
      ],
    },
  ]);

  const selectItem = (label) => {
    //Validae if user has access to this module
    // const userPermissions = auth.allowed_modules.split(",");
    // const userHasAccess = userPermissions.find((item) => item == privilege);
    // console.log(userHasAccess);
    // if (!isParent) {
    //   if (!userHasAccess) {
    //     console.log("YOU DON'T HAVE ACCESS TO THIS MODULE");
    //     return;
    //   }
    // }

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
                  {sbItem.label}
                  {/* - {`(${sbItem.subItems.length})`} */}
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
