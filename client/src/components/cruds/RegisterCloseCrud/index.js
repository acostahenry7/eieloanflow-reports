import React from "react";
import { SearchBar } from "../../SearchBar";
import { Datatable } from "../../Datatable";
import { getRegisterClose } from "../../../api/loan";
import { formatClientName } from "../../../utils/stringFunctions";
import { getOutletsApi } from "../../../api/outlet";
import { Margin, usePDF } from "react-to-pdf";
import "./index.css";
import { tableUIHelper } from "../../../utils/ui-helpers";
import CurrencyFormat from "react-currency-format";
import { currencyFormat } from "../../../utils/reports/report-helpers";
import { TotalBar } from "../../TotalBar";
import { generateReport } from "../../../utils/reports/resgisterClose";

function RegisterCloseCrud() {
  const [outlets, setOutlets] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [reqToggle, setReqToggle] = React.useState([]);
  const [searchParams, setSearchParams] = React.useState([]);
  const [searchedText, setSearchedText] = React.useState("");

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

        setData(parseData);

        console.log(parseData);
      } catch (error) {
        console.log(error.message);
      }
      setIsLoading(false);
    })();
  }, [reqToggle, searchParams]);

  const [columns, setColumns] = React.useState([
    {
      name: "Empleado",
      width: "250px",
      selector: (row) => (
        <div>
          <p style={{ margin: 0, fontWeight: 500 }}>
            {formatClientName(row.register.employee_name)}
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
      selector: (row) => row.child.length,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Total apertura",
      width: tableUIHelper.columns.width.amount,
      selector: (row) => currencyFormat(row.register.amount),
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Total de efectivo",
      width: tableUIHelper.columns.width.amount,
      selector: (row) => currencyFormat(row.register.total_cash),
      sortable: true,
      reorder: true,
      omit: false,
    },

    {
      name: "Total de cheques",
      width: tableUIHelper.columns.width.amount,
      selector: (row) => currencyFormat(row.register.total_check),
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Total de transferencia",
      width: tableUIHelper.columns.width.amount,
      selector: (row) => currencyFormat(row.register.total_transfer),
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Descuento",
      width: tableUIHelper.columns.width.amount,
      selector: (row) => currencyFormat(row.register.total_discount),
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Total pagado",
      width: tableUIHelper.columns.width.amount,
      selector: (row) => currencyFormat(row.register.total_pay),
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Fecha de apertura",
      selector: (row) =>
        new Date(row.register.opening_date).toLocaleString("en-US"),
      sortable: true,
      reorder: true,
      omit: false,
    },
  ]);

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

  const secondaryFilters = [
    {
      label: "Fecha",
      field: "date",
      placeholder: "Búsqueda por nombre",
      type: "dateRange",
    },
  ];

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
    generateReport(filterData, conf);
  };

  return (
    <div className="crud-container">
      <SearchBar
        mainFilters={mainFilters}
        secondaryFilters={secondaryFilters}
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
                  selector: (row) => row.pay,
                  sortable: true,
                  reorder: true,
                  omit: false,
                },
                {
                  name: "Tipo de pago",
                  selector: (row) => row.payment_type,
                  sortable: true,
                  reorder: true,
                  omit: false,
                },

                {
                  name: "Fecha",
                  selector: (row) =>
                    new Date(row.created_date).toLocaleString("en-US"),
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
                                ?.reduce(
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
          }}
          marginTopPagination={100}
        />
        {filterData.length > 0 && (
          <TotalBar data={filterData} loadingStatus={isLoading} />
        )}
      </div>
    </div>
  );
}

export { RegisterCloseCrud };
