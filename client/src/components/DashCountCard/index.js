import React from "react";
import { daysInMonth, getPreviousDateByDays } from "../../utils/dateFunctions";
import { FallingLines } from "react-loader-spinner";
import "./index.css";
import { currencyFormat } from "../../utils/reports/report-helpers";

function DashCountCard({
  cardName,
  amount,
  movementPct,
  customerMessage,
  movementAmount,
  setReqToggle,
  setSearchParams,
  isLoading,
  normal,
  arrear,
  filterActive = true,
}) {
  return (
    <div className="item card">
      <div className="card-header">
        <div className="name">{cardName}</div>
        {/* {filterActive && (
          <div className="filter">
            <select
              onChange={(e) => {
                console.log(e.target.value);
                if (e.target.value.length > 0) {
                  console.log("klk");
                  let { days, isPrev } = JSON.parse(e.target.value);
                  let daysTo = isPrev == true ? days - 1 : days;

                  let currentDays = new Date().getDate();

                  if (currentDays == days) days--;

                  setSearchParams({
                    dateFrom: getPreviousDateByDays(days),
                    dateTo: getPreviousDateByDays(daysTo, true),
                  });
                } else {
                  setSearchParams({
                    dateFrom: undefined,
                    dateTo: undefined,
                  });
                }
              }}
            >
              <option value={""}>Todo el tiempo</option>
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
        )} */}
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
              <p>{currencyFormat(amount, false, 0)}</p>
              <br />
              <div>
                <span style={{ fontSize: 12, color: "rgba(196, 193, 193)" }}>
                  Atraso{" "}
                </span>
                <div
                  className="movement"
                  style={{
                    backgroundColor:
                      arrear > normal
                        ? "rgba(164, 28, 28, 0.16)"
                        : "rgba(8, 253, 90, 0.26)",
                    color:
                      arrear > normal
                        ? "rgba(151, 49, 49, 0.8)"
                        : "rgb(35, 155, 75)",
                  }}
                >
                  {amount > 0
                    ? currencyFormat(
                        Math.round((arrear / amount) * 100),
                        false,
                        0
                      )
                    : "0.00"}
                  %
                </div>
              </div>
            </div>
          </div>
          <div className="des">
            {customerMessage ? (
              <p>
                {customerMessage} <b>{movementAmount}</b>
              </p>
            ) : (
              <p>
                Se registra un movimeinto de <b>${movementAmount}</b>
              </p>
            )}
            <div className="des-stats">
              <div className="des-stat-item">
                <span>Normal</span>{" "}
                <b style={{ color: "#4ac34a" }}>
                  {currencyFormat(normal, false, 0)}
                </b>
              </div>
              <div className="des-stat-item">
                Atraso{" "}
                <b style={{ color: "#e17c7c" }}>
                  {currencyFormat(arrear, false, 0)}
                </b>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export { DashCountCard };
