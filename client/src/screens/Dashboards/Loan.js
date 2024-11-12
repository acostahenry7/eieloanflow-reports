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
import { getLoanTypeLabel } from "../../utils/stringFunctions";
import { AuthContext } from "../../contexts/AuthContext";

function LoanDash() {
  const [outlets, setOutlets] = React.useState([]);
  const [countData, setCountData] = React.useState([]);
  const [countArrearLoans, setCountArrearLoans] = React.useState([]);
  const [countPaidLoans, setCountPaidLoans] = React.useState([]);
  const [amountData, setAmountData] = React.useState([]);
  const [pendingData, setPendingData] = React.useState([]);
  const [lineChartData, setLineChartData] = React.useState([]);
  const [barChartData, setBarChartData] = React.useState({});
  const [pieChartData, setPieChartData] = React.useState([]);
  const [isCountLoading, setCountIsLoading] = React.useState(false);
  const [isCountArrearLoading, setIsCountArrearLoading] = React.useState(false);
  const [isCountPaidLoading, setIsCountPaidLoading] = React.useState(false);
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
    dateFrom: undefined,
    dateTo: undefined,
  });

  const [searchAmountParams, setSearchAmountParams] = React.useState({
    dateFrom: undefined,
    dateTo: undefined,
  });

  const [searchArrearLoanParamas, setSearchArrearLoanParamas] = React.useState({
    dateFrom: undefined,
    dateTo: undefined,
  });
  const [searchPaidLoanParamas, setSearchPaidLoanParamas] = React.useState({
    dateFrom: undefined,
    dateTo: undefined,
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
        const outlets = await getOutletsApi({ outletId: auth.outlet_id });

        setOutlets(outlets.body);
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, [outletParam]);

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
          ...searchCountParams,
          status: "CREATED",
          //dateTo: tdate.toISOString().split("T")[0],
        });
        if (loanApplication.error == true) {
          throw new Error(loanApplication.body);
        }

        console.log(loanApplication);
        //setOutlets(outlets.body);
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
        setIsCountArrearLoading(true);
        let defaultOutlets = outlets
          .map((item) => "'" + item.outlet_id + "'")
          .join();
        const arrearLoans = await getLoanArrear({
          outletId:
            !outletParam || outletParam == "" ? defaultOutlets : outletParam,
          ...searchArrearLoanParamas,
          //dateTo: tdate.toISOString().split("T")[0],
        });
        if (arrearLoans.error == true) {
          throw new Error(arrearLoans.body);
        }

        setCountArrearLoans(arrearLoans.body);
      } catch (error) {
        console.log(error.message);
      }
      setIsCountArrearLoading(false);
    })();
  }, [outletParam, searchArrearLoanParamas]);

  React.useEffect(() => {
    (async () => {
      try {
        setIsCountPaidLoading(true);
        const paidLoans = await getLoanCounter({
          outletId: outletParam,
          ...searchPaidLoanParamas,
          status: "PAID",
          //dateTo: tdate.toISOString().split("T")[0],
        });
        if (paidLoans.error == true) {
          throw new Error(paidLoans.body);
        }

        setCountPaidLoans(paidLoans.body);
      } catch (error) {
        console.log(error.message);
      }
      setIsCountPaidLoading(false);
    })();
  }, [outletParam, searchPaidLoanParamas]);

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

        <div className="counter-list" style={{}}>
          <DashCountCard
            cardName={"Activos"}
            amount={currencyFormat(countData[0]?.count, false)}
            movementPct={(
              countData.length /
              lineChartData
                .map((item) => item.amount_of_apps)
                .reduce((acc, item) => acc + parseFloat(item), 0)
            ).toFixed(3)}
            movementAmount={4000}
            setSearchParams={setSearchCountParams}
            isLoading={isCountLoading}
          />
          <DashCountCard
            cardName={"En atraso"}
            amount={currencyFormat(
              parseInt(countArrearLoans[0]?.amount_of_loans),
              false
            )}
            movementPct={(
              countArrearLoans.length /
              lineChartData
                .map((item) => item.amount_of_apps)
                .reduce((acc, item) => acc + parseFloat(item), 0)
            ).toFixed(3)}
            movementAmount={4000}
            setSearchParams={setSearchArrearLoanParamas}
            isLoading={isCountArrearLoading}
          />
          <DashCountCard
            cardName={"Saldados"}
            amount={currencyFormat(parseInt(countPaidLoans[0]?.count), false)}
            movementPct={(
              countData.length /
              lineChartData
                .map((item) => item.amount_of_apps)
                .reduce((acc, item) => acc + parseFloat(item), 0)
            ).toFixed(3)}
            customerMessage={`Se traduce en un total cobrado de `}
            movementAmount={currencyFormat(countPaidLoans[0]?.amount)}
            setSearchParams={setSearchPaidLoanParamas}
            isLoading={isCountPaidLoading}
          />
        </div>
        <div className="list">
          <DashCountCard
            cardName={"Monto aprovado"}
            amount={currencyFormat(countData[0]?.amount, true)}
            movementPct={8.6}
            movementAmount={12}
            setSearchParams={setSearchCountParams}
            isLoading={isCountLoading}
            filterActive={false}
          />

          <DashCountCard
            cardName={"Monto en atraso"}
            amount={currencyFormat(parseInt(countArrearLoans[0]?.total_arrear))}
            movementPct={4}
            setSearchParams={setSearchAmountParams}
            isLoading={isCountArrearLoading}
            filterActive={false}
            customerMessage={`Este monto toma en cuenta las moras`}
            movementAmount={""}
          />
          <DashCountCard
            cardName={"Refinanciados, Transferidos . . ."}
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
