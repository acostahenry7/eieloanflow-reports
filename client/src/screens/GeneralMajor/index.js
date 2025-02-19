import React from "react";
import { TopBar } from "../../components/TopBar";
//import { generate607Api } from "../../api/accounting";
import { ThreeDots } from "react-loader-spinner";
import { getMajorGeneral } from "../../api/accounting";
import { generateReport } from "../../utils/reports/majorGeneral";
import { SearchBar } from "../../components/SearchBar";
import { getOutletsApi } from "../../api/outlet";
import { Datatable } from "../../components/Datatable";
import "./index.css";
import CurrencyFormat from "react-currency-format";

function GeneralMajor() {
  const [outlets, setOutlets] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [searchParams, setSearchParams] = React.useState({
    dateFrom: new Date().toISOString().split("T")[0],
    dateTo: new Date().toISOString().split("T")[0],
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [reqToggle, setReqToggle] = React.useState([]);
  const [searchedText, setSearchedText] = React.useState("");
  const [accountBalances, setAccountBalances] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      const outlets = await getOutletsApi({});
      setOutlets(outlets.body);
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      setAccountBalances([]);
      let response = await getMajorGeneral(searchParams);
      setAccountBalances(response.body.balanceByAccount);
    })();
  }, [searchParams.outletId, searchParams.accountName, reqToggle]);

  React.useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        console.log("hi");
        //setAccountBalances([]);
        let response = await getMajorGeneral(searchParams);
        //setAccountBalances(response.body.balanceByAccount);
        let arr = Object.entries(response.body.data).map((item) => ({
          account: item[1][0],
          transactions: item[1],
        }));

        setData(arr);
        // const outlets = await getOutletsApi({});
        // setOutlets(outlets.body);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [reqToggle, searchParams]);

  console.log(searchParams);

  const [columns, setColumns] = React.useState([
    // {
    //   name: "Cliente",
    //   width: "250px",
    //   selector: (row) => (
    //     <div>
    //       <p style={{ margin: 0, fontWeight: 500 }}>
    //         {formatClientName(row.customer_name)}
    //       </p>
    //       <span style={{ fontSize: 12 }}>{row.identification}</span>
    //     </div>
    //   ),
    //   sortable: true,
    //   reorder: true,
    //   wrap: true,
    //   omit: false,
    // },
    {
      name: "Número",
      selector: (row) => row.account.number,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Descripción",
      selector: (row) => row.account.name,
      sortable: true,
      reorder: true,
      omit: false,
    },
    // {
    //   name: "Recibo",
    //   width: "140px",
    //   selector: (row) => row.receipt_number,
    //   sortable: true,
    //   reorder: true,
    //   omit: false,
    // },

    // {
    //   name: "Empleado",
    //   selector: (row) => row.employee_name,
    //   sortable: true,
    //   reorder: true,
    //   omit: false,
    // },
    // {
    //   name: "Fecha cancelación",
    //   selector: (row) =>
    //     new Date(row.last_modified_date).toLocaleString("es-DO"),
    //   sortable: true,
    //   reorder: true,
    //   omit: false,
    // },
    // {
    //   name: "Comentario",
    //   selector: (row) => row.comment || "----------",
    //   sortable: true,
    //   reorder: true,
    //   omit: false,
    // },
    // {
    //   name: "Estado",
    //   selector: (row) =>
    //     row.status_type === "CANCEL" ? "Cancelado" : "Activo",
    //   sortable: true,
    //   reorder: true,
    //   omit: false,
    //   hide: "lg",
    // },
  ]);

  const mainFilters = [
    {
      label: "No. cuenta",
      field: "accountNumber",
      placeholder: "Búsqueda por número",
      type: "text",
    },

    {
      label: "Empleado",
      field: "employeeName",
      placeholder: "Búsqueda por cajero",
      type: "text",
      isNotDynamic: true,
    },
    {
      label: "Sucursal",
      field: "outletId",
      type: "select",
      updateForm: true,
      currentValue: searchParams.outletId,
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
      label: "Cuenta",
      field: "accountName",
      placeholder: "Búsqueda por nombre",
      type: "select",
      options: [
        {
          label: "Todas las cuentas",
          value: "",
        },
        ...accountBalances?.map((item) => {
          return {
            label: `${item.number} - ${item.name}`,
            value: item.number,
          };
        }),
      ],
    },
    {
      label: "Tipo Transaccion",
      field: "transType",
      type: "select",
      options: [
        {
          label: "Todos",
          value: "",
        },
        {
          label: "Crédito",
          value: "credit",
        },
        {
          label: "Débito",
          value: "debit",
        },
      ],
    },
  ];

  let [secondaryFilters, setSecondaryFilters] = React.useState([
    {
      label: "Fecha",
      field: "date",
      placeholder: "Búsqueda por nombre",
      type: "dateRange",
      isActive: true,
      from: new Date().toISOString().split("T")[0],
      to: new Date().toISOString().split("T")[0],
    },
  ]);

  const filterData = data.filter((item) => {
    let searchText = `accountNumber${item?.account.number}accountName${item?.account.name}`;
    return searchText.toLowerCase().includes(searchedText.toLocaleLowerCase());
  });

  const generateMajorGeneral = () => {
    try {
      setIsLoading(true);
      // let response = await getMajorGeneral(searchParams);

      let reportConfig = {
        title: outlets.filter(
          (item) => item.outlet_id == searchParams.outletId
        )[0].name,
        date: `De ${new Date(searchParams.dateFrom)
          .toUTCString()
          .slice(5, 16)} al ${new Date(searchParams.dateTo)
          .toUTCString()
          .slice(5, 16)}`,
        currentAccount: searchParams.accountName,
        previousBalances: accountBalances,
      };
      console.log(data);
      generateReport(filterData, reportConfig);
      setIsLoading(false);

      // console.log(response);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <TopBar title="Mayor General" />
      <div className="screen-content">
        <div className="crud-container">
          <SearchBar
            mainFilters={mainFilters}
            secondaryFilters={secondaryFilters}
            setSecondaryFilters={setSecondaryFilters}
            setSearchParams={setSearchParams}
            searchParams={searchParams}
            setSearchedText={setSearchedText}
            setRequestToggle={setReqToggle}
            exportFunction={() => generateMajorGeneral()}
          />

          {/* {isLoading && <ThreeDots />} */}
          <Datatable
            columns={columns}
            data={filterData}
            isLoading={isLoading}
            dtOptions={{
              expandableRows: true,
              expandableRowsComponent: ({ data }) => {
                let innerColumns = [
                  {
                    name: "Fecha asiento",
                    selector: (row) =>
                      new Date(row.created_date).toLocaleDateString("es-DO"),
                    sortable: true,
                    reorder: true,
                    omit: false,
                  },
                  {
                    name: "Descripción",
                    selector: (row) => row.description,
                    sortable: true,
                    reorder: true,
                    omit: false,
                  },
                  {
                    name: "Débito",
                    selector: (row) => row.debit,
                    sortable: true,
                    reorder: true,
                    omit: false,
                  },
                  {
                    name: "Crédito",
                    selector: (row) => row.credit,
                    sortable: true,
                    reorder: true,
                    omit: false,
                  },
                  // {
                  //   name: "Tipo de pago",
                  //   selector: (row) =>
                  //     row.payment_type == "CASH" ? "Efectivo" : "Transferencia",
                  //   sortable: true,
                  //   reorder: true,
                  //   omit: false,
                  // },

                  // {
                  //   name: "Fecha",
                  //   selector: (row) =>
                  //     new Date(row.created_date)
                  //       .toLocaleString("es-ES")
                  //       .split(",")[0],
                  //   sortable: true,
                  //   reorder: true,
                  //   omit: false,
                  // },
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
                      data={data.transactions}
                      marginTopPagination={18}
                    />
                    {/* {data.length > 0 && (
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
                  )} */}
                  </div>
                );
              },
              fixedHeader: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export { GeneralMajor };
