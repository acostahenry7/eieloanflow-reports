import React from "react";
import { DashCountCard } from "../../components/DashCountCard";
import { DoughnutChart } from "../../components/DoughnutChart";
import { LineChart } from "../../components/LineChart";
import { BarChart } from "../../components/BarChart";
import {
  getLoans,
  getLoanApplication,
  getLoanApplicationByMonth,
  getLoanApplicationByType,
  getLoansByMonth,
} from "../../api/loan";
import { getOutletsApi } from "../../api/outlet";
import { daysInMonth, getPreviousDateByDays } from "../../utils/dateFunctions";
import { currencyFormat } from "../../utils/reports/report-helpers";

import "./index.css";
import { FallingLines } from "react-loader-spinner";
import { getLoanTypeLabel } from "../../utils/stringFunctions";
import { AuthContext } from "../../contexts/AuthContext";

function LoanDash() {
  const [outlets, setOutlets] = React.useState([]);
  const [countData, setCountData] = React.useState([]);
  const [amountData, setAmountData] = React.useState([]);
  const [pendingData, setPendingData] = React.useState([]);
  const [lineChartData, setLineChartData] = React.useState([]);
  const [barChartData, setBarChartData] = React.useState({});
  const [pieChartData, setPieChartData] = React.useState([]);
  const [isCountLoading, setCountIsLoading] = React.useState(false);
  const [isAmountLoading, setAmountIsLoading] = React.useState(false);
  const [isPendingLoading, setPendingIsLoading] = React.useState(false);
  const [isLineChartLoading, setLineChartIsLoading] = React.useState(false);
  const [isBarChartLoading, setBarChartIsLoading] = React.useState(false);
  const [isPieChartLoading, setPieChartIsLoading] = React.useState(false);
  const [reqToggle, setReqToggle] = React.useState([]);
  const [searchedText, setSearchedText] = React.useState("");

  let tdate = new Date();
  let currentYear = tdate.getFullYear();

  const { auth } = React.useContext(AuthContext);

  const [outletParam, setOutletParam] = React.useState("");
  const [searchCountParams, setSearchCountParams] = React.useState({
    dateFrom: getPreviousDateByDays(0),
    dateTo: getPreviousDateByDays(0),
  });

  const [searchAmountParams, setSearchAmountParams] = React.useState({
    dateFrom: getPreviousDateByDays(0),
    dateTo: getPreviousDateByDays(0),
  });

  const [searchPendingParams, setSearchPendingParams] = React.useState({
    dateFrom: getPreviousDateByDays(0),
    dateTo: getPreviousDateByDays(0),
  });

  const [searchLineChartParams, setSearchLineChartParams] = React.useState({
    targetYear: currentYear,
  });

  const [searchBarChartParams, setSearchBarChartParams] = React.useState({
    targetYear: currentYear,
  });

  const [searchPieChartParams, setSearchPieChartParams] = React.useState({
    dateFrom: getPreviousDateByDays(0),
    dateTo: getPreviousDateByDays(0),
  });

  React.useEffect(() => {
    (async () => {
      try {
        setCountIsLoading(true);
        const outlets = await getOutletsApi({ outletId: auth.outlet_id });
        const loanApplication = await getLoans({
          outletId: outletParam,
          ...searchCountParams,
          //dateTo: tdate.toISOString().split("T")[0],
        });
        if (loanApplication.error == true) {
          throw new Error(loanApplication.body);
        }

        setOutlets(outlets.body);
        setCountData(loanApplication.body);
      } catch (error) {
        console.log(error.message);
      }
      setCountIsLoading(false);
    })();
  }, [outletParam, searchCountParams]);

  React.useEffect(() => {
    (async () => {
      try {
        setAmountIsLoading(true);

        const loanApplication = await getLoans({
          outletId: outletParam,
          ...searchAmountParams,
          // dateTo: tdate.toISOString().split("T")[0],
        });
        if (loanApplication.error == true) {
          throw new Error(loanApplication.body);
        }

        setAmountData(loanApplication.body);
      } catch (error) {
        console.log(error.message);
      }
      setAmountIsLoading(false);
    })();
  }, [outletParam, searchAmountParams]);

  React.useEffect(() => {
    (async () => {
      try {
        setPendingIsLoading(true);

        const loanApplication = await getLoans({
          outletId: outletParam,
          ...searchPendingParams,
          // dateTo: tdate.toISOString().split("T")[0],
        });
        if (loanApplication.error == true) {
          throw new Error(loanApplication.body);
        }

        setPendingData(loanApplication.body);
      } catch (error) {
        console.log(error.message);
      }
      setPendingIsLoading(false);
    })();
  }, [outletParam, searchPendingParams]);

  React.useEffect(() => {
    (async () => {
      try {
        setLineChartIsLoading(true);

        const loanApplication = await getLoansByMonth({
          outletId: outletParam,
          ...searchLineChartParams,
          dateTo: tdate.toISOString().split("T")[0],
        });
        if (loanApplication.error == true) {
          throw new Error(loanApplication.body);
        }
        console.log(loanApplication);
        setLineChartData(loanApplication.body.loans);
      } catch (error) {
        console.log(error.message);
      }
      setLineChartIsLoading(false);
    })();
  }, [outletParam, searchLineChartParams]);

  React.useEffect(() => {
    (async () => {
      try {
        setBarChartIsLoading(true);

        const loanApplication = await getLoansByMonth({
          outletId: outletParam,
          ...searchBarChartParams,
          dateTo: tdate.toISOString().split("T")[0],
        });
        if (loanApplication.error == true) {
          throw new Error(loanApplication.body);
        }

        setBarChartData(loanApplication.body);
      } catch (error) {
        console.log(error.message);
      }
      setBarChartIsLoading(false);
    })();
  }, [outletParam, searchBarChartParams]);

  React.useEffect(() => {
    (async () => {
      try {
        setPieChartIsLoading(true);

        const loanApplication = await getLoanApplicationByType({
          outletId: outletParam,
          ...searchPieChartParams,
          //dateTo: tdate.toISOString().split("T")[0],
        });
        if (loanApplication.error == true) {
          throw new Error(loanApplication.body);
        }

        setPieChartData(loanApplication.body);
      } catch (error) {
        console.log(error.message);
      }
      setPieChartIsLoading(false);
    })();
  }, [outletParam, searchPieChartParams]);

  return (
    <div className="dash-container">
      <div className="loan-requests">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div className="title">Préstamos</div>
            <div className="sub-title">Resumen de los préstamos</div>
          </div>
          <div>
            <div className="filter">
              <select
                onChange={(e) => {
                  setOutletParam(e.target.value);
                }}
              >
                <option value="">Todas las sucursales</option>
                {outlets.map((item, index) => (
                  <option key={index} value={item.outlet_id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="list">
          <DashCountCard
            cardName={"Préstamos"}
            amount={currencyFormat(countData.length, false)}
            movementPct={8.6}
            movementAmount={12}
            setSearchParams={setSearchCountParams}
            isLoading={isCountLoading}
          />

          <DashCountCard
            cardName={"Total solicitado"}
            amount={currencyFormat(
              amountData.reduce(
                (acc, item) => acc + parseFloat(item.amount_approved),
                0
              )
            )}
            movementPct={4}
            movementAmount={12}
            setSearchParams={setSearchAmountParams}
            isLoading={isAmountLoading}
          />
          <DashCountCard
            cardName={"Préstamos pendientes"}
            amount={currencyFormat(
              pendingData.filter((item) => item.status_type === "CREATED")
                .length,
              false
            )}
            movementPct={1}
            movementAmount={12}
            setSearchParams={{}}
          />

          <div className="item">
            <div className="card-header">
              <div className="name">Préstamos realizadas</div>
              <div className="filter">
                <select
                  style={{ marginRight: 10 }}
                  onChange={(e) =>
                    setSearchLineChartParams({ targetYear: e.target.value })
                  }
                >
                  {[...Array(10).keys()].map((item, index) => {
                    let year = currentYear--;
                    return (
                      <option key={index} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
                <select>
                  <option>Todos</option>
                  <option>Personal</option>
                  <option>Vehículos</option>
                  <option>Hipotecario</option>
                  <option>Pymes</option>
                  <option>Micro</option>
                  <option>Seguro</option>
                </select>
              </div>
            </div>

            {isLineChartLoading ? (
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
              <LineChart
                dataLabels={["Préstamos"]}
                data={lineChartData.map((item) => item.amount_of_apps)}
              />
            )}
          </div>
          <div className="item categories">
            <div
              className="card-header"
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div className="name">Tipos</div>
              <div className="filter">
                <select
                  onChange={(e) => {
                    let { days, isPrev } = JSON.parse(e.target.value);
                    let daysTo = isPrev == true ? days - 1 : days;

                    let currentDays = new Date().getDate();
                    if (currentDays == days) days--;

                    setSearchPieChartParams({
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
                    value={JSON.stringify({
                      days: daysInMonth(0),
                      isPrev: false,
                    })}
                  >
                    Este mes
                  </option>
                  <option
                    value={JSON.stringify({
                      days: daysInMonth(1),
                      isPrev: true,
                    })}
                  >
                    Mes anterior
                  </option>
                  <option
                    value={JSON.stringify({
                      days: daysInMonth(3),
                      isPrev: true,
                    })}
                  >
                    Últimos 3 meses
                  </option>
                  <option
                    value={JSON.stringify({
                      days: daysInMonth(6),
                      isPrev: true,
                    })}
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
            {isPieChartLoading ? (
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
              <DoughnutChart
                labels={[
                  ...pieChartData.map((item) =>
                    getLoanTypeLabel(item.loan_type)
                  ),
                ]}
                data={[
                  ...pieChartData.map((item) => parseInt(item.amount_of_apps)),
                ]}
                dataLabels={[]}
              />
            )}
          </div>
          <div className="item">
            <div className="card-header">
              <div className="name">Solicitudes - préstamos</div>
              <div className="filter">
                <select
                  style={{ marginRight: 10 }}
                  onChange={(e) =>
                    setSearchBarChartParams({ targetYear: e.target.value })
                  }
                >
                  {(currentYear = tdate.getFullYear())}
                  {[...Array(10).keys()].map((item, index) => {
                    let year = currentYear--;
                    return (
                      <option key={20 + index} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
                <select>
                  <option>Todos</option>
                  <option>Personal</option>
                  <option>Vehículos</option>
                  <option>Hipotecario</option>
                  <option>Pymes</option>
                  <option>Micro</option>
                  <option>Seguro</option>
                  <option>Empleado</option>
                </select>
              </div>
            </div>
            {isBarChartLoading ? (
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
              <BarChart
                dataLabels={["Solicitudes", "Préstamos"]}
                data={[
                  barChartData.applications?.map((item) => item.amount_of_apps),
                  barChartData.loans?.map((item) => item.amount_of_apps),
                ]}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { LoanDash };