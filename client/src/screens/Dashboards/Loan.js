import React, { useDebugValue } from "react";
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
  getLoanArrear,
  getLoanPaid,
  getLoanCounter,
} from "../../api/loan";
import { getOutletsApi } from "../../api/outlet";
import { daysInMonth, getPreviousDateByDays } from "../../utils/dateFunctions";
import { currencyFormat } from "../../utils/reports/report-helpers";

import "./index.css";
import { FallingLines } from "react-loader-spinner";
import {
  getLoanSituationLabel,
  getLoanTypeLabel,
} from "../../utils/stringFunctions";
import { AuthContext } from "../../contexts/AuthContext";
import { groupBy, orderBy } from "lodash";

function LoanDash() {
  const [outlets, setOutlets] = React.useState([]);
  const [countData, setCountData] = React.useState([]);
  const [lineChartData, setLineChartData] = React.useState([]);
  const [barChartData, setBarChartData] = React.useState({});
  const [pieChartData, setPieChartData] = React.useState([]);
  const [isCountLoading, setCountIsLoading] = React.useState(false);
  const [isLineChartLoading, setLineChartIsLoading] = React.useState(false);
  const [isBarChartLoading, setBarChartIsLoading] = React.useState(false);
  const [isPieChartLoading, setPieChartIsLoading] = React.useState(false);
  const [reqToggle, setReqToggle] = React.useState([]);
  const [searchedText, setSearchedText] = React.useState("");

  let tdate = new Date();
  let currentYear = tdate.getFullYear();

  const { auth } = React.useContext(AuthContext);

  const [outletParam, setOutletParam] = React.useState("");

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
    dateFrom: "",
    dateTo: "",
  });

  React.useEffect(() => {
    (async () => {
      try {
        const outlets = await getOutletsApi({ outletId: auth.outlet_id });

        setOutlets(outlets.body);
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      try {
        setCountIsLoading(true);
        //const outlets = await getOutletsApi({ outletId: auth.outlet_id });
        let defaultOutlets = outlets
          .map((item) => "'" + item.outlet_id + "'")
          .join();
        const loanApplication = await getLoanCounter({
          outletId:
            !outletParam || outletParam == "" ? defaultOutlets : outletParam,
          ...searchPeriodParams,
          //dateTo: tdate.toISOString().split("T")[0],
        });
        if (loanApplication.error == true) {
          throw new Error(loanApplication.body);
        }

        console.log("LOAN APP", loanApplication);
        //setOutlets(outlets.body);
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

  // React.useEffect(() => {
  //   (async () => {
  //     try {
  //       setPieChartIsLoading(true);

  //       const loanApplication = await getLoanApplicationByType({
  //         outletId: outletParam,
  //         ...searchPieChartParams,
  //         //dateTo: tdate.toISOString().split("T")[0],
  //       });
  //       if (loanApplication.error == true) {
  //         throw new Error(loanApplication.body);
  //       }

  //       setPieChartData(loanApplication.body);
  //     } catch (error) {
  //       console.log(error.message);
  //     }
  //     setPieChartIsLoading(false);
  //   })();
  // }, [outletParam, searchPieChartParams]);

  const getCountByParams = (arr, cb) => {
    return arr
      .filter((item) => cb(item))
      .reduce((acc, item) => acc + parseInt(item.count), 0);
  };
  const getAmountByParams = (arr, cb) => {
    return arr
      .filter((item) => cb(item))
      .reduce((acc, item) => acc + parseInt(item.amount), 0);
  };

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

        <div className="counter-list" style={{}}>
          <DashCountCard
            cardName={"Activos"}
            amount={getCountByParams(
              countData,
              (item) => item.status_type == "CREATED"
            )}
            customerMessage="Monto total aprovado"
            movementAmount={currencyFormat(
              getAmountByParams(
                countData,
                (item) => item.status_type == "CREATED"
              )
            )}
            isLoading={isCountLoading}
            normal={getCountByParams(
              countData,
              (item) =>
                item.status_type == "CREATED" && item.loan_situation == "NORMAL"
            )}
            arrear={getCountByParams(
              countData,
              (item) =>
                item.status_type == "CREATED" &&
                item.loan_situation == "ARREARS"
            )}
          />
          <DashCountCard
            cardName={"Saldados"}
            amount={getCountByParams(
              countData,
              (item) => item.status_type == "PAID"
            )}
            customerMessage={`Se traduce en un total cobrado de `}
            movementAmount={currencyFormat(
              getAmountByParams(countData, (item) => item.status_type == "PAID")
            )}
            isLoading={isCountLoading}
            normal={getCountByParams(
              countData,
              (item) =>
                item.status_type == "PAID" && item.loan_situation == "NORMAL"
            )}
            arrear={getCountByParams(
              countData,
              (item) =>
                item.status_type == "PAID" && item.loan_situation == "ARREARS"
            )}
          />
          <DashCountCard
            cardName={"Refinanciados"}
            amount={getCountByParams(
              countData,
              (item) => item.status_type == "REFINANCE"
            )}
            movementAmount={currencyFormat(
              getAmountByParams(
                countData,
                (item) => item.status_type == "REFINANCE"
              )
            )}
            //setSearchParams={setSearchArrearLoanParamas}
            isLoading={isCountLoading}
            normal={getCountByParams(
              countData,
              (item) =>
                item.status_type == "REFINANCE" &&
                item.loan_situation == "NORMAL"
            )}
            arrear={getCountByParams(
              countData,
              (item) =>
                item.status_type == "REFINANCE" &&
                item.loan_situation == "ARREARS"
            )}
          />
        </div>
        <div className="list">
          <DashCountCard
            cardName={"Transferidos"}
            amount={getCountByParams(
              countData,
              (item) => item.status_type == "TRANSFERRED"
            )}
            movementAmount={currencyFormat(
              getAmountByParams(
                countData,
                (item) => item.status_type == "TRANSFERRED"
              )
            )}
            //setSearchParams={setSearchArrearLoanParamas}
            isLoading={isCountLoading}
            normal={getCountByParams(
              countData,
              (item) =>
                item.status_type == "TRANSFERRED" &&
                item.loan_situation == "NORMAL"
            )}
            arrear={getCountByParams(
              countData,
              (item) =>
                item.status_type == "TRANSFERRED" &&
                item.loan_situation == "ARREARS"
            )}
          />

          <DashCountCard
            cardName={"Renegociados"}
            amount={getCountByParams(
              countData,
              (item) => item.status_type == "RENEGOTIATED"
            )}
            movementAmount={currencyFormat(
              getAmountByParams(
                countData,
                (item) => item.status_type == "RENEGOTIATED"
              )
            )}
            //setSearchParams={setSearchArrearLoanParamas}
            isLoading={isCountLoading}
            normal={getCountByParams(
              countData,
              (item) =>
                item.status_type == "RENEGOTIATED" &&
                item.loan_situation == "NORMAL"
            )}
            arrear={getCountByParams(
              countData,
              (item) =>
                item.status_type == "RENEGOTIATED" &&
                item.loan_situation == "ARREARS"
            )}
          />
          <DashCountCard
            cardName={"Incobrables"}
            amount={getCountByParams(
              countData,
              (item) => item.status_type == "BAD_LOAN"
            )}
            movementAmount={currencyFormat(
              getAmountByParams(
                countData,
                (item) => item.status_type == "BAD_LOAN"
              )
            )}
            //setSearchParams={setSearchArrearLoanParamas}
            isLoading={isCountLoading}
            normal={getCountByParams(
              countData,
              (item) =>
                item.status_type == "BAD_LOAN" &&
                item.loan_situation == "NORMAL"
            )}
            arrear={getCountByParams(
              countData,
              (item) =>
                item.status_type == "BAD_LOAN" &&
                item.loan_situation == "ARREARS"
            )}
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
              {/* <div className="filter">
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
              </div> */}
              <div className="filter">
                <select>
                  <option value={"CREATED"}>Activos</option>
                  <option value={"PAID"}>Saldados</option>
                  <option value={"REFINANCE"}>Refinanciados</option>
                  <option value={"TRANSFERRED"}>Transferidos</option>
                  <option value={"RENEGOCIATED"}>Renegociados</option>
                  <option value={"BAD_LOAN"}>Incobrables</option>
                </select>
              </div>
            </div>
            {isCountLoading ? (
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
                  ...Object.keys(
                    countData.reduce(
                      (k, { loan_type }) => (
                        (k[getLoanTypeLabel(loan_type)] = ""), k
                      ),
                      {}
                    )
                  ),
                ]}
                data={[
                  ...Object.values(groupBy(countData, "loan_type")).map(
                    (item) =>
                      item.reduce(
                        (acc, sbItem) => acc + parseInt(sbItem.count),
                        0
                      )
                  ),
                ]}
                dataLabels={[]}
              />
            )}
            {console.log()}
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
