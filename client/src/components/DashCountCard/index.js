import React from "react";
import { daysInMonth, getPreviousDateByDays } from "../../utils/dateFunctions";
import { FallingLines } from "react-loader-spinner";
import "./index.css";

function DashCountCard({
  cardName,
  amount,
  movementPct,
  movementAmount,
  setReqToggle,
  setSearchParams,
  isLoading,
}) {
  return (
    <div className="item card">
      <div className="card-header">
        <div className="name">{cardName}</div>
        <div className="filter">
          <select
            onChange={(e) => {
              let { days, isPrev } = JSON.parse(e.target.value);
              let daysTo = isPrev == true ? days - 1 : days;

              let currentDays = new Date().getDate();

              if (currentDays == days) days--;

              setSearchParams({
                dateFrom: getPreviousDateByDays(days),
                dateTo: getPreviousDateByDays(daysTo, true),
              });
            }}
          >
            <option value={JSON.stringify({ days: 0, isPrev: false })}>
              Hoy
            </option>
            <option value={JSON.stringify({ days: 15, isPrev: false })}>
              Últimos 15 días
            </option>
            <option
              value={JSON.stringify({ days: daysInMonth(0), isPrev: false })}
            >
              Este mes
            </option>
            <option
              value={JSON.stringify({ days: daysInMonth(1), isPrev: true })}
            >
              Mes anterior
            </option>
            <option
              value={JSON.stringify({ days: daysInMonth(3), isPrev: true })}
            >
              Últimos 3 meses
            </option>
            <option
              value={JSON.stringify({ days: daysInMonth(6), isPrev: true })}
            >
              Últimos 6 meses
            </option>
            <option
              value={JSON.stringify({
                days: daysInMonth(new Date().getMonth()),
                isPrev: false,
              })}
            >
              Último año
            </option>
          </select>
        </div>
      </div>
      {isLoading ? (
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FallingLines color=" rgba(8, 253, 90, 0.26)" />
        </div>
      ) : (
        <>
          <div className="card-body">
            <div className="amount">
              <p>{amount}</p>
              <br />
              <div className="movement">{movementPct}%</div>
            </div>
          </div>
          <div className="des">
            <p>
              Se registra un movimeinto del <b>${movementAmount}%</b> desde el
              último mes
            </p>
            <div className="des-stats">
              <div className="des-stat-item">icon --</div>
              <div className="des-stat-item">icon --</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export { DashCountCard };
