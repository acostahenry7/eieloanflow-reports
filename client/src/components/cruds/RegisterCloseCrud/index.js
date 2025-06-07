import React from "react";
import { SearchBar } from "../../SearchBar";
import { Datatable } from "../../Datatable";
import { getRegisterClose } from "../../../api/loan";
import {
  formatClientName,
  getPaymentTotalByType,
  getTotalPaymentDiscount,
} from "../../../utils/stringFunctions";
import { getOutletsApi } from "../../../api/outlet";
import { Margin, usePDF } from "react-to-pdf";
import { tableUIHelper } from "../../../utils/ui-helpers";
import CurrencyFormat from "react-currency-format";
import { currencyFormat } from "../../../utils/reports/report-helpers";
import { TotalBar } from "../../TotalBar";
import { generateReport } from "../../../utils/reports/resgisterClose";
import "./index.css";

function RegisterCloseCrud() {
  const [outlets, setOutlets] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [reqToggle, setReqToggle] = React.useState(false);
  const [searchedText, setSearchedText] = React.useState("");
  const [searchParams, setSearchParams] = React.useState({
    dateFrom: new Date().toISOString().split("T")[0],
    dateTo: new Date().toISOString().split("T")[0],
  });

  const { toPDF, targetRef } = usePDF({
    filename: "reporte-pagos-recibidos.pdf",
    page: { margin: Margin.MEDIUM },
  });

  React.useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const outlets = await getOutletsApi();
        const registers = await getRegisterClose(searchParams);
        if (registers.error == true) {
          throw new Error(registers.body);
        }

        setOutlets(outlets.body);

        let parseData = Object.values(registers.body).map((i, index) => ({
          register: i[0],
          child: i,
        }));

        console.log(parseData);
        setData(parseData);

        console.log(parseData);
      } catch (error) {
        console.log(error.message);
      }
      setIsLoading(false);
    })();
  }, [reqToggle, searchParams]);

  let totalsLabel = "Totales";
  const [columns, setColumns] = React.useState([
    {
      name: "Empleado",
      width: "198px",
      selector: (row) => (
        <div>
          <p style={{ margin: 0, fontWeight: 500 }}>
            {row.register.employee_name == totalsLabel ? (
              <b>{formatClientName(row.register.employee_name)}</b>
            ) : (
              formatClientName(row.register.employee_name)
            )}
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
      name: "Cant. Transacciones",
      width: tableUIHelper.columns.width.amount,
      selector: (row) =>
        row.register.employee_name == totalsLabel ? (
          <b>{row.register.transactions}</b>
        ) : (
          row.child.length
        ),
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Total apertura",
      width: tableUIHelper.columns.width.amount,
      selector: (row) =>
        row.register.employee_name == totalsLabel
          ? row.register.total_opening
          : currencyFormat(row.register.amount, false),
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Total de efectivo",
      width: tableUIHelper.columns.width.amount,
      selector: (row) =>
        row.register.employee_name == totalsLabel
          ? currencyFormat(row.register.total_cash, false)
          : currencyFormat(
              getPaymentTotalByType([{ child: row.child }], "CASH"),
              false
            ),
      sortable: true,
      reorder: true,
      omit: false,
    },

    {
      name: "Total de cheques",
      width: tableUIHelper.columns.width.amount,
      selector: (row) =>
        row.register.employee_name == totalsLabel
          ? currencyFormat(row.register.total_check, false)
          : currencyFormat(
              getPaymentTotalByType([{ child: row.child }], "CHECK"),
              false
            ),
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Total de transferencia",
      width: tableUIHelper.columns.width.amount,
      selector: (row) =>
        row.register.employee_name == totalsLabel
          ? currencyFormat(row.register.total_transfer, false)
          : currencyFormat(
              getPaymentTotalByType([{ child: row.child }], "CASH"),
              false
            ),
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Descuento",
      width: tableUIHelper.columns.width.amount,
      selector: (row) =>
        row.register.employee_name == totalsLabel
          ? currencyFormat(row.register.total_discount, false)
          : currencyFormat(
              row.child.reduce(
                (acc, i) =>
                  acc +
                  parseFloat(i.pay_off_loan_discount) +
                  parseFloat(i.loan_discount),
                0
              ),
              false
            ),
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Total pagado",
      width: tableUIHelper.columns.width.amount,
      selector: (row) =>
        row.register.employee_name == totalsLabel
          ? currencyFormat(row.register.total_pay, false)
          : currencyFormat(
              getPaymentTotalByType([{ child: row.child }], "CASH") +
                getPaymentTotalByType([{ child: row.child }], "CHECK") +
                getPaymentTotalByType([{ child: row.child }], "TRANSFER"),
              false
            ),
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Fecha de apertura",
      selector: (row) =>
        row.register.opening_date
          ? new Date(row.register.opening_date)
              .toLocaleString("es-ES", {
                day: "2-digit",
                month: "numeric",
                year: "numeric",
              })
              .split(",")[0]
          : row.register.opening_date,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Fecha de cierre",
      selector: (row) =>
        row.register.last_modified_date
          ? new Date(row.register.last_modified_date)
              .toLocaleString("es-ES", {
                day: "2-digit",
                month: "numeric",
                year: "numeric",
              })
              .split(",")[0]
          : row.register.last_modified_date,
      sortable: true,
      reorder: true,
      omit: false,
    },

    // {
    //   name: "Comisión",
    //   width: tableUIHelper.columns.width.amount,
    //   selector: (row) =>
    //     currencyFormat(
    //       parseFloat(row.register.collector_percentage / 100 || 0) *
    //         row.child.reduce((acc, item) => acc + parseFloat(item.pay), 0)
    //     ),
    //   sortable: true,
    //   reorder: true,
    //   omit: false,
    // },
  ]);
  const conditionalRowStyles = [
    {
      when: (row) =>
        filterData[0]?.register?.register_id === row?.register?.register_id &&
        row?.register?.register_id.includes("total"), // Condición para la última fila
      style: {
        backgroundColor: "#dee2e6",
        fontWeight: "bold",
        fontSize: 14,
      },
    },
  ];

  const mainFilters = [
    {
      label: "Empleado",
      field: "employeeName",
      placeholder: "Búsqueda por nombre",
      type: "text",
    },

    // {
    //   label: "No. Préstamo",
    //   field: "loanNumber",
    //   placeholder: "No. Préstamo",
    //   type: "text",
    // },
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
  ];

  const [secondaryFilters, setSecondaryFilters] = React.useState([
    {
      label: "Fecha",
      field: "date",
      placeholder: "Búsqueda por nombre",
      type: "dateRange",
      from: new Date().toISOString().split("T")[0],
      to: new Date().toISOString().split("T")[0],
      isActive: true,
    },
  ]);

  const filterData = data.filter((item) => {
    let searchText = `employeeName${item.register.employee_name}indetification${item.identification}loanNumber${item.loan_number_id}createdBy${item.created_by}receiptNumber${item.receipt_number}`;
    return searchText.toLowerCase().includes(searchedText.toLocaleLowerCase());
  });

  const exportPDF = () => {
    let reportDate = new Date(searchParams.dateTo);

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
    let arr = [...filterData];
    //arr.shift();

    generateReport(arr, conf);
  };

  console.log(filterData);
  filterData.unshift({
    register: {
      register_id: "total_id",
      employee_name: totalsLabel,
      opening_date: "",
      transactions: filterData.reduce((acc, i) => acc + i.child.length, 0),
      total_opening: currencyFormat(
        filterData.reduce((acc, i) => acc + parseFloat(i.register.amount), 0),
        false
      ),
      total_cash: getPaymentTotalByType(filterData, "CASH"),
      total_check: getPaymentTotalByType(filterData, "CHECK"),
      total_transfer: getPaymentTotalByType(filterData, "TRANSFER"),
      total_discount: getTotalPaymentDiscount(filterData),
      total_pay:
        getPaymentTotalByType(filterData, "CASH") +
        getPaymentTotalByType(filterData, "CHECK") +
        getPaymentTotalByType(filterData, "TRANSFER") -
        getTotalPaymentDiscount(filterData),
    },
    child: [],
  });
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
          data={[...filterData]}
          isLoading={isLoading}
          dtOptions={{
            expandableRows: true,
            expandableRowsComponent: ({ data }) => {
              let innerColumns = [
                {
                  name: "Préstamo",
                  width: "120px",
                  selector: (row) => row.loan_number_id,
                  sortable: true,
                  reorder: true,
                  omit: false,
                },
                {
                  name: "Cliente",
                  selector: (row) => row.customer_name,
                  sortable: true,
                  reorder: true,
                  omit: false,
                },
                {
                  name: "Pago",
                  selector: (row) => currencyFormat(row.pay),
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
                  name: "Descuento",
                  selector: (row) => row.loan_discount,
                  sortable: true,
                  reorder: true,
                  omit: false,
                },
                {
                  name: "Estatus",
                  selector: (row) =>
                    row.status_type == "ENABLED" ? "Realizado" : "Cancelado",
                  sortable: true,
                  reorder: true,
                  omit: false,
                },

                {
                  name: "Fecha",
                  selector: (row) =>
                    new Date(row.created_date)
                      .toLocaleString("es-ES")
                      .split(",")[0],
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
                    data={data.child}
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
                      <div>Total</div>
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
                          <li
                            style={{
                              fontWeight: "bold",
                              fontSize: 12,
                              marginLeft: "175px",
                            }}
                          >
                            <CurrencyFormat
                              value={data.child
                                ?.filter(
                                  (item) => item.status_type == "ENABLED"
                                )
                                .reduce(
                                  (acc, item) => acc + parseFloat(item.pay),
                                  0
                                )
                                .toFixed(2)}
                              displayType={"text"}
                              thousandSeparator={true}
                              prefix={"RD$"}
                            />
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            },
            fixedHeader: true,
            expandableRowDisabled: (row) =>
              filterData[0]?.register?.register_id ===
              row?.register?.register_id,
            conditionalRowStyles: conditionalRowStyles,
          }}
          marginTopPagination={0}
        />
        {/* {filterData.length > 0 && (
          <TotalBar data={filterData} loadingStatus={isLoading} />
        )} */}
      </div>
    </div>
  );
}

export { RegisterCloseCrud };
