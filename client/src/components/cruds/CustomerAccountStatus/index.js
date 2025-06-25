import React from "react";
import { SearchBar } from "../../SearchBar";
import { Datatable } from "../../Datatable";
import { getLoanMovement } from "../../../api/loan";
import {
  formatClientName,
  getLoanSituationLabel,
  getLoanTypeLabel,
  getSumWithIdx,
} from "../../../utils/stringFunctions";
import { getOutletsApi } from "../../../api/outlet";
import { Margin, usePDF } from "react-to-pdf";
import { tableUIHelper } from "../../../utils/ui-helpers";
import CurrencyFormat from "react-currency-format";
import { currencyFormat } from "../../../utils/reports/report-helpers";
import { TotalBar } from "../../TotalBar";
import { generateReport } from "../../../utils/reports/customerAccountStatus";
import "./index.css";
import { getCustomerAccountStatusApi } from "../../../api/customer";
import { AuthContext } from "../../../contexts/AuthContext";

function CustomerAccountCrud() {
  const [outlets, setOutlets] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [reqToggle, setReqToggle] = React.useState([]);
  const [searchedText, setSearchedText] = React.useState("");
  const [searchParams, setSearchParams] = React.useState({});

  const { toPDF, targetRef } = usePDF({
    filename: "Estado-de-cuentas.pdf",
    page: { margin: Margin.MEDIUM },
  });

  const { auth } = React.useContext(AuthContext);

  React.useEffect(() => {
    const loadPrevData = async () => {
      try {
        const outlets = await getOutletsApi({ outletId: auth.outlet_id });
        setOutlets(outlets.body);
      } catch (error) {
        console.log(error);
      }
    };

    loadPrevData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const loanMovements = await getCustomerAccountStatusApi(searchParams);
      if (loanMovements.error == true) {
        throw new Error(loanMovements.body);
      }

      let parseData = Object.values(loanMovements.body).map((i, index) => ({
        loanMovement: i[0],
        child: i,
      }));

      setData(parseData);
    } catch (error) {
      setData([]);
      console.log(error.message);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, [reqToggle]);

  const [columns, setColumns] = React.useState([
    {
      name: "Cliente",
      selector: (row) => (
        <div>
          <p style={{ margin: 0, fontWeight: 500 }}>
            {formatClientName(row.loanMovement.customer_name)}
          </p>
          {/* <span style={{ fontSize: 12 }}>{row.identification}</span> */}
        </div>
      ),
      sortable: true,
      reorder: true,
      wrap: true,
      omit: false,
    },
    {
      name: "Cédula / Pasaporte",
      selector: (row) => (
        <div>
          <p style={{ margin: 0, fontWeight: 500 }}>
            {formatClientName(row.loanMovement.identification)}
          </p>
          {/* <span style={{ fontSize: 12 }}>{row.identification}</span> */}
        </div>
      ),
      sortable: true,
      reorder: true,
      wrap: true,
      omit: false,
    },
    {
      name: "No. Préstamo",
      selector: (row) => row.loanMovement.loan_number_id,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Tipo",
      selector: (row) => getLoanTypeLabel(row.loanMovement.loan_type),
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Situación",
      selector: (row) => getLoanSituationLabel(row.loanMovement.loan_situation),
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Estatus",
      selector: (row) => getLoanSituationLabel(row.loanMovement.status_type),
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Transacciones",
      width: tableUIHelper.columns.width.amount,
      selector: (row) => row.child.length,
      sortable: true,
      reorder: true,
      omit: false,
    },
    // {
    //   name: "Total de efectivo",
    //   width: tableUIHelper.columns.width.amount,
    //   selector: (row) => currencyFormat(row.loanMovement.total_cash),
    //   sortable: true,
    //   reorder: true,
    //   omit: false,
    // },

    // {
    //   name: "Total de cheques",
    //   width: tableUIHelper.columns.width.amount,
    //   selector: (row) => currencyFormat(row.loanMovement.total_check),
    //   sortable: true,
    //   reorder: true,
    //   omit: false,
    // },
    // {
    //   name: "Total de transferencia",
    //   width: tableUIHelper.columns.width.amount,
    //   selector: (row) => currencyFormat(row.loanMovement.total_transfer),
    //   sortable: true,
    //   reorder: true,
    //   omit: false,
    // },
    // {
    //   name: "Descuento",
    //   width: tableUIHelper.columns.width.amount,
    //   selector: (row) => currencyFormat(row.loanMovement.total_discount),
    //   sortable: true,
    //   reorder: true,
    //   omit: false,
    // },
    // {
    //   name: "Total pagado",
    //   width: tableUIHelper.columns.width.amount,
    //   selector: (row) => currencyFormat(row.loanMovement.total_pay),
    //   sortable: true,
    //   reorder: true,
    //   omit: false,
    // },
    // {
    //   name: "Fecha de apertura",
    //   selector: (row) =>
    //     new Date(row.loanMovement.opening_date)
    //       .toLocaleString("es-ES", {
    //         day: "2-digit",
    //         month: "numeric",
    //         year: "numeric",
    //       })
    //       .split(",")[0],
    //   sortable: true,
    //   reorder: true,
    //   omit: false,
    // },
    // {
    //   name: "Comisión",
    //   width: tableUIHelper.columns.width.amount,
    //   selector: (row) =>
    //     currencyFormat(
    //       parseFloat(row.loanMovement.collector_percentage / 100 || 0) *
    //         row.child.reduce((acc, item) => acc + parseFloat(item.pay), 0)
    //     ),
    //   sortable: true,
    //   reorder: true,
    //   omit: false,
    // },
  ]);

  const mainFilters = [
    {
      label: "Sucursal",
      field: "outletId",
      type: "select",
      options: [
        {
          label: "Todas las sucursales",
          value: "",
        },
        ...outlets.map((item) => {
          return {
            label: item.name,
            value: item.outlet_id,
          };
        }),
      ],
    },
    {
      label: "Cedula / Pasaporte",
      field: "identification",
      placeholder: "001-0000000-2",
      type: "text",
    },

    {
      label: "No. Préstamo",
      field: "loanNumber",
      placeholder: "No. Préstamo",
      type: "text",
    },
  ];

  const [secondaryFilters, setSecondaryFilters] = React.useState([
    {
      label: "Estado del préstamo",
      field: "loanStatus",
      type: "select",
      options: [
        {
          label: "Todos",
          value: "",
        },
        {
          label: "Creado",
          value: "CREATED",
        },
        {
          label: "Pagado",
          value: "PAID",
        },
        {
          label: "Cancelado",
          value: "CANCEL",
        },
        {
          label: "Renegociado",
          value: "RENEGOTIATED",
        },
        {
          label: "Transferido",
          value: "TRANSFERRED",
        },
        {
          label: "Incobrable",
          value: "BAD-LOAN",
        },
        {
          label: "Reenganchado",
          value: "reenganchado",
        },
      ],
      isActive: true,
    },
  ]);

  const filterData = data.filter((item) => {
    let searchText = `identification${item.loanMovement.identification}loanNumber${item.loanMovement.loan_number_id}createdBy${item.created_by}receiptNumber${item.receipt_number}`;
    return searchText.toLowerCase().includes(searchedText.toLocaleLowerCase());
  });

  const exportPDF = () => {
    let reportDate = new Date();

    let outletName = outlets.filter(
      (item) => item.outlet_id == searchParams.outletId
    )[0]?.name;
    let conf = {
      title: outletName || "Todas las sucursales",
      date: reportDate.toLocaleString("es-Es", {
        timeZone: "UTC",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
    generateReport(filterData, conf);
  };

  return (
    <div className="crud-container">
      <SearchBar
        mainFilters={mainFilters}
        secondaryFilters={secondaryFilters}
        setSecondaryFilters={setSecondaryFilters}
        setRequestToggle={setReqToggle}
        setSearchParams={setSearchParams}
        setSearchedText={setSearchedText}
        columns={columns}
        setColumns={setColumns}
        exportFunction={() => exportPDF()}
      />
      {/* <button onClick={toPDF}>exportar</button> */}
      <div ref={targetRef}>
        <Datatable
          columns={columns}
          data={filterData}
          isLoading={isLoading}
          dtOptions={{
            expandableRows: true,
            expandableRowsComponent: ({ data }) => {
              console.log(data);
              let innerColumns = [
                {
                  name: "Fecha pago",
                  selector: (row) =>
                    new Date(row.created_date).toLocaleString("do-ES", {
                      // day: "2-digit",
                      // month: "nu",
                      // year: "numeric",
                      // hour: "numeric",
                      // minute: "numeric",
                    }),
                  sortable: true,
                  reorder: true,
                  omit: false,
                },
                // {
                //   name: "Cliente",
                //   selector: (row) => row.customer_name,
                //   sortable: true,
                //   reorder: true,
                //   omit: false,
                // },
                {
                  name: "Pago",
                  selector: (row) => currencyFormat(row.pay),
                  sortable: true,
                  reorder: true,
                  omit: false,
                },
                {
                  name: "Cts. pagadas",
                  selector: (row) => (
                    <div
                      style={{
                        textWrap: "wrap",
                        maxWidth: 130,
                      }}
                    >
                      {row.quota_number}
                    </div>
                  ),
                  sortable: true,
                  reorder: true,
                  omit: false,
                },
                {
                  name: "Tipo de pago",
                  selector: (row) =>
                    row.payment_type == "CASH" ? "Efectivo" : "Transferencia",
                  sortable: true,
                  reorder: true,
                  omit: false,
                },

                {
                  name: "Estatus",
                  selector: (row) =>
                    (() => {
                      //console.log("ROW", row);
                      let status = getLoanSituationLabel(row.payment_status);

                      return status;
                    })(),
                  sortable: true,
                  reorder: true,
                  omit: false,
                },

                {
                  name: "Balance",
                  selector: (row) => currencyFormat(row.balance, false, 2),
                  sortable: true,
                  reorder: true,
                  omit: false,
                },
              ];

              return (
                <div
                  style={{
                    boxShadow: "inset 1px 4px 3px rgba(0,0,0,0.2)",
                    padding: 20,
                    borderRadius: 2,
                    backgroundColor: "#f7fbff",
                  }}
                >
                  <Datatable
                    columns={innerColumns}
                    data={data.child.map((item, index) => ({
                      ...item,
                      balance:
                        parseFloat(item.balance) -
                        getSumWithIdx(data.child, index + 1, "pay"),
                    }))}
                    marginTopPagination={18}
                  />
                  {filterData.length > 0 && (
                    <div
                      style={{
                        display: isLoading ? "none" : "flex",
                        alignItems: "center",
                        marginTop: "-46px",
                        paddingLeft: 8,
                        // justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      {/* <div>Total</div> */}
                      <div style={{ zIndex: 3 }} className="list-container">
                        <ul
                          style={{
                            display: "flex",
                            // width: "100%",
                            // paddingLeft: 200,
                            // boxSizing: "border-box",
                            // width: "70%",
                            // justifyContent: "flex-start",
                          }}
                        >
                          {/* <li
                            style={{
                              fontWeight: "bold",
                              fontSize: 12,
                              marginLeft: "175px",
                            }}
                          >
                            <CurrencyFormat
                              value={data.child
                                ?.reduce(
                                  (acc, item) => acc + parseFloat(item.pay),
                                  0
                                )
                                .toFixed(2)}
                              displayType={"text"}
                              thousandSeparator={true}
                              prefix={"RD$"}
                            />
                          </li> */}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            },
            fixedHeader: true,
          }}
          marginTopPagination={100}
        />
        {/* {filterData.length > 0 && (
          <TotalBar data={filterData} loadingStatus={isLoading} />
        )} */}
      </div>
    </div>
  );
}

export { CustomerAccountCrud };
