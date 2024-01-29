import React from "react";
import { TopBar } from "../../components/TopBar";
//import { generate607Api } from "../../api/accounting";
import { ThreeDots } from "react-loader-spinner";
import "./index.css";
import { getAccountCatalog, getMajorGeneral } from "../../api/accounting";
import { generateReport } from "../../utils/reports/majorGeneral";
import { SearchBar } from "../../components/SearchBar";
import { getOutletsApi } from "../../api/outlet";
import { Datatable } from "../../components/Datatable";

function DetailedGeneralMajor() {
  const [outlets, setOutlets] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [accounts, setAccounts] = React.useState([]);
  const [searchParams, setSearchParams] = React.useState({
    outletId: "4a812a14-f46d-4a99-8d88-c1f14ea419f4",
    accountId: "110",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [reqToggle, setReqToggle] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const outlets = await getOutletsApi({});
        const accountList = await getAccountCatalog({
          outletId: "f0fd5eb9-ecfb-4f88-8f1a-b83c6b5b1352",
        });
        setOutlets(outlets.body);
        setAccounts(accountList.body);

        let response = await getMajorGeneral(searchParams);
        console.log("response", response);
        // let accountList = Object.entries(response.body)
        //   .sort()
        //   .map((item) => ({
        //     number: item[0],
        //     name: item[1][0].name,
        //   }));

        let arr = Object.entries(response.body).map((item) => ({
          account: item[1][0],
          transactions: item[1],
        }));
        console.log(arr);
        setData(arr);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [reqToggle]);

  const generateDetailedMajorGeneral = async () => {
    console.log(searchParams);
    try {
      setIsLoading(true);
      let response = await getMajorGeneral(searchParams);

      let reportConfig = {
        title: outlets.filter(
          (item) => item.outlet_id == searchParams.outletId
        )[0].name,
        date: `De ${new Date(searchParams.dateFrom).toLocaleDateString(
          "es-DO",
          {
            day: "numeric",
            month: "short",
            timeZone: "UTC",
          }
        )} al ${new Date(searchParams.dateTo).toLocaleDateString("es-DO", {
          day: "numeric",
          month: "short",
          year: "numeric",
          timeZone: "UTC",
        })}`,
      };
      generateReport(response.body, reportConfig);
      setIsLoading(false);

      console.log(response);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

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

  let mainFilters = [
    {
      label: "Sucursal",
      field: "outletId",
      type: "select",
      options: [
        // {
        //   label: "Todas las sucursales",
        //   value: "",
        // },
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
      field: "accountId",
      type: "select",
      updateForm: true,
      options: [
        {
          label: "Todas las cuentas",
          value: "",
        },
        ...accounts?.map((item) => {
          return {
            label: `${item.number} ${item.name}`,
            value: `${item.number}`,
          };
        }),
      ],
    },
  ];

  let secondaryFilters = [
    {
      label: "Fecha",
      field: "date",
      placeholder: "Búsqueda por nombre",
      type: "dateRange",
    },
  ];

  console.log(data);

  return (
    <div className="">
      <TopBar title="Mayor General Detallado" />
      <div className="screen-content">
        <SearchBar
          mainFilters={mainFilters}
          secondaryFilters={secondaryFilters}
          setSearchParams={setSearchParams}
          setRequestToggle={setReqToggle}
          exportFunction={async () => await generateDetailedMajorGeneral()}
        />

        {isLoading && <ThreeDots />}
        <Datatable
          columns={columns}
          data={data}
          // dtOptions={{
          //   expandableRows: true,
          //   expandableRowsComponent: ({ data }) => {
          //     let innerColumns = [
          //       {
          //         name: "Fecha asiento",
          //         selector: (row) =>
          //           new Date(row.created_date).toLocaleDateString("es-DO"),
          //         sortable: true,
          //         reorder: true,
          //         omit: false,
          //       },
          //       {
          //         name: "Descripción",
          //         selector: (row) => row.description,
          //         sortable: true,
          //         reorder: true,
          //         omit: false,
          //       },
          //       {
          //         name: "Débito",
          //         selector: (row) => row.debit,
          //         sortable: true,
          //         reorder: true,
          //         omit: false,
          //       },
          //       {
          //         name: "Crédito",
          //         selector: (row) => row.credit,
          //         sortable: true,
          //         reorder: true,
          //         omit: false,
          //       },
          //       // {
          //       //   name: "Tipo de pago",
          //       //   selector: (row) =>
          //       //     row.payment_type == "CASH" ? "Efectivo" : "Transferencia",
          //       //   sortable: true,
          //       //   reorder: true,
          //       //   omit: false,
          //       // },

          //       // {
          //       //   name: "Fecha",
          //       //   selector: (row) =>
          //       //     new Date(row.created_date)
          //       //       .toLocaleString("es-ES")
          //       //       .split(",")[0],
          //       //   sortable: true,
          //       //   reorder: true,
          //       //   omit: false,
          //       // },
          //     ];

          //     return (
          //       <div
          //         style={{
          //           boxShadow: "inset 1px 4px 3px rgba(0,0,0,0.2)",
          //           padding: 20,
          //           borderRadius: 2,
          //           backgroundColor: "#f7fbff",
          //         }}
          //       >
          //         <Datatable
          //           columns={innerColumns}
          //           data={data.transactions}
          //           marginTopPagination={18}
          //         />
          //         {/* {data.length > 0 && (
          //           <div
          //             style={{
          //               display: isLoading ? "none" : "flex",
          //               alignItems: "center",
          //               marginTop: "-46px",
          //               paddingLeft: 8,
          //               // justifyContent: "space-between",
          //               width: "100%",
          //             }}
          //           >
          //             <div>Total</div>
          //             <div style={{ zIndex: 3 }} className="list-container">
          //               <ul
          //                 style={{
          //                   display: "flex",
          //                   // width: "100%",
          //                   // paddingLeft: 200,
          //                   // boxSizing: "border-box",
          //                   // width: "70%",
          //                   // justifyContent: "flex-start",
          //                 }}
          //               >
          //                 <li
          //                   style={{
          //                     fontWeight: "bold",
          //                     fontSize: 12,
          //                     marginLeft: "175px",
          //                   }}
          //                 >
          //                   <CurrencyFormat
          //                     value={data.child
          //                       ?.reduce(
          //                         (acc, item) => acc + parseFloat(item.pay),
          //                         0
          //                       )
          //                       .toFixed(2)}
          //                     displayType={"text"}
          //                     thousandSeparator={true}
          //                     prefix={"RD$"}
          //                   />
          //                 </li>
          //               </ul>
          //             </div>
          //           </div>
          //         )} */}
          //       </div>
          //     );
          //   },
          //   fixedHeader: true,
          // }}
        />
      </div>
    </div>
  );
}

export { DetailedGeneralMajor };
