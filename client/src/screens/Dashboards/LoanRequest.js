import React from "react";
import { DashCountCard } from "../../components/DashCountCard";
import { DoughnutChart } from "../../components/DoughnutChart";
import { LineChart } from "../../components/LineChart";
import { BarChart } from "../../components/BarChart";
import {
  getLoanApplication,
  getLoanApplicationByMonth,
  getLoanApplicationByType,
  getLoanApplicationCounter,
  getLoansByMonth,
} from "../../api/loan";
import { getOutletsApi } from "../../api/outlet";
import { daysInMonth, getPreviousDateByDays } from "../../utils/dateFunctions";
import { currencyFormat } from "../../utils/reports/report-helpers";

import "./index.css";
import { FallingLines } from "react-loader-spinner";
import { getLoanTypeLabel } from "../../utils/stringFunctions";
import { AuthContext } from "../../contexts/AuthContext";

function LoanRequest() {
  const [outlets, setOutlets] = React.useState([]);
  const [countData, setCountData] = React.useState([]);
  const [pendingData, setPendingData] = React.useState([]);
  const [lineChartData, setLineChartData] = React.useState([]);
  const [barChartData, setBarChartData] = React.useState({});
  const [pieChartData, setPieChartData] = React.useState([]);
  const [isCountLoading, setCountIsLoading] = React.useState(false);
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
    // dateFrom: getPreviousDateByDays(0),
    // dateTo: getPreviousDateByDays(0),
  });

  const [searchPeriodParams, setSearchPeriodParams] = React.useState({
    dateFrom: undefined,
    dateTo: undefined,
  });

  const [searchLineChartParams, setSearchLineChartParams] = React.useState({
    targetYear: currentYear,
  });

  const [searchBarChartParams, setSearchBarChartParams] = React.useState({
    targetYear: currentYear,
  });

  const [searchPieChartParams, setSearchPieChartParams] = React.useState({
    // dateFrom: getPreviousDateByDays(0),
    // dateTo: getPreviousDateByDays(0),
  });

  React.useEffect(() => {
    (async () => {
      try {
        setCountIsLoading(true);
        const outlets = await getOutletsApi({ outletId: auth.outlet_id });
        //console.log(outlets.body.map((item) => item.outlet_id).join());
        let defaultOutlets = outlets.body
          .map((item) => "'" + item.outlet_id + "'")
          .join();
        console.log("ll", outletParam);
        const loanApplication = await getLoanApplicationCounter({
          outletId:
            !outletParam || outletParam == "" ? defaultOutlets : outletParam,
          ...searchPeriodParams,
          //dateTo: tdate.toISOString().split("T")[0],
        });
        if (loanApplication.error == true) {
          throw new Error(loanApplication.body);
        }

        setOutlets(outlets.body);
        console.log(loanApplication.body);
        setCountData(loanApplication.body);
      } catch (error) {
        console.log(error.message);
      }
      setCountIsLoading(false);
    })();
  }, [outletParam, searchPeriodParams]);

  React.useEffect(() => {
    (async () => {
      try {
        setPendingIsLoading(true);

        const loanApplication = await getLoanApplication({
          outletId: outletParam,
          ...searchPeriodParams,
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
  }, [outletParam, searchPeriodParams]);

  React.useEffect(() => {
    (async () => {
      try {
        setLineChartIsLoading(true);

        const loanApplication = await getLoanApplicationByMonth({
          outletId: outletParam,
          ...searchLineChartParams,
          dateTo: tdate.toISOString().split("T")[0],
        });
        if (loanApplication.error == true) {
          throw new Error(loanApplication.body);
        }

        setLineChartData(loanApplication.body);
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
          ...searchLineChartParams,
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
  }, [outletParam, searchLineChartParams]);

  React.useEffect(() => {
    (async () => {
      try {
        setPieChartIsLoading(true);

        const loanApplication = await getLoanApplicationByType({
          outletId: outletParam,
          ...searchPeriodParams,
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
  }, [outletParam, searchPeriodParams]);

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
            <div className="title">Solicitudes</div>
            <div className="sub-title">Resumen de las solicitudes</div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
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
                    console.log({
                      dateFrom: getPreviousDateByDays(days),
                      dateTo: getPreviousDateByDays(daysTo, true),
                    });

                    setSearchPeriodParams({
                      dateFrom: getPreviousDateByDays(days),
                      dateTo: getPreviousDateByDays(daysTo, true),
                    });
                  } else {
                    setSearchPeriodParams({
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
                  value={JSON.stringify({
                    days: daysInMonth(0),
                    isPrev: false,
                  })}
                >
                  Este mes
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
                    days: daysInMonth(12),
                    isPrev: false,
                  })}
                >
                  Últimos 12 meses
                </option>
              </select>
            </div>
            <div className="filter">
              <select
                onChange={(e) => {
                  setOutletParam(e.target.value);
                }}
              >
                <option value={""}>Todas las sucursales</option>
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
            cardName={"Solicitudes"}
            amount={currencyFormat(countData[0]?.count, false)}
            movementPct={(
              countData.length /
              lineChartData
                .map((item) => item.amount_of_apps)
                .reduce((acc, item) => acc + parseFloat(item), 0)
            ).toFixed(3)}
            movementAmount={10}
            setSearchParams={setSearchCountParams}
            isLoading={isCountLoading}
          />

          <DashCountCard
            cardName={"Monto solicitado"}
            amount={currencyFormat(countData[0]?.amount)}
            movementPct={4}
            movementAmount={10}
            setSearchParams={setSearchCountParams}
            isLoading={isCountLoading}
            filterActive={false}
          />
          <DashCountCard
            cardName={"Pendientes"}
            amount={currencyFormat(
              pendingData.filter((item) => item.status_type === "CREATED")
                .length,
              false
            )}
            movementPct={8.6}
            movementAmount={10}
            setSearchParams={setSearchPeriodParams}
            isLoading={isPendingLoading}
          />

          <div className="item">
            <div className="card-header">
              <div className="name">Solicitudes realizadas</div>
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
                {/* <select>
                  <option>Todos</option>
                  <option>Personal</option>
                  <option>Vehículos</option>
                  <option>Hipotecario</option>
                  <option>Pymes</option>
                  <option>Micro</option>
                  <option>Seguro</option>
                </select> */}
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
                dataLabels={["Solicitudes"]}
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
              <div className="name">Por tipos de préstamo</div>
              <div className="filter">
                <select
                  onChange={(e) => {
                    if (e.target.value.length > 0) {
                      console.log("klk");
                      let { days, isPrev } = JSON.parse(e.target.value);
                      let daysTo = isPrev == true ? days - 1 : days;

                      let currentDays = new Date().getDate();

                      if (currentDays == days) days--;

                      setSearchPieChartParams({
                        dateFrom: getPreviousDateByDays(days),
                        dateTo: getPreviousDateByDays(daysTo, true),
                      });
                    } else {
                      setSearchPieChartParams({
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

                {/* <input type="date" value={tdate.toLocaleDateString("en-CA")} /> */}
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
                  ...pieChartData?.map((item) =>
                    getLoanTypeLabel(item.loan_type)
                  ),
                ]}
                data={[
                  ...pieChartData?.map((item) => parseInt(item.amount_of_apps)),
                ]}
                dataLabels={[]}
              />
            )}
          </div>
          <div className="item">
            <div className="card-header">
              <div className="name">Solicitudes - préstamos</div>
              {/* <div className="filter">
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
              </div> */}
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

export { LoanRequest };
