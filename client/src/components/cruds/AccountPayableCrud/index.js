import React from "react";
import { SearchBar } from "../../SearchBar";
import { Datatable } from "../../Datatable";
import { getLoanDetail } from "../../../api/loan";
import {
  formatClientName,
  getLoanSituationLabel,
  getLoanTypeLabel,
} from "../../../utils/stringFunctions";
import { getPayableAccount } from "../../../api/accounting";
import { getOutletsApi } from "../../../api/outlet";
import { ThreeDots } from "react-loader-spinner";
import { currencyFormat } from "../../../utils/reports/report-helpers";
import { generateReport } from "../../../utils/reports/toChargeAccount";
import { tableUIHelper } from "../../../utils/ui-helpers";

function AccountPayableCrud() {
  const [outlets, setOutlets] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [reqToggle, setReqToggle] = React.useState([]);
  const [searchedText, setSearchedText] = React.useState("");
  const [currentLoanId, setCurrentLoanId] = React.useState("");
  const [searchParams, setSearchParams] = React.useState({
    dateFrom: new Date().toISOString().split("T")[0],
    dateTo: new Date().toISOString().split("T")[0],
  });

  React.useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const outlets = await getOutletsApi();
        const response = await getPayableAccount(searchParams);
        if (response.error == true) {
          throw new Error(response.body);
        }
        console.log(response.body);
        setOutlets(outlets.body);
        setData(response.body);
      } catch (error) {
        console.log(error.message);
      }
      setIsLoading(false);
    })();
  }, [reqToggle, searchParams, currentLoanId]);

  console.log("hola", searchParams);

  const [columns, setColumns] = React.useState([
    {
      name: "Proveedor",
      width: "250px",
      selector: (row) => (
        <div>
          <p style={{ margin: 0, fontWeight: 500 }}>
            {formatClientName(row.supplier_name)}
          </p>
          <span style={{ fontSize: 12 }}>{row.rnc}</span>
        </div>
      ),
      sortable: true,
      reorder: true,
      wrap: true,
      omit: false,
    },
    {
      name: "Concepto",
      width: "220px",
      selector: (row) => row.concept,
      sortable: true,
      reorder: true,
      omit: false,
    },
    // {
    //   name: "Sucursal",
    //   width: "140px",
    //   selector: (row) => row.outlet_name,
    //   sortable: true,
    //   reorder: true,
    //   omit: false,
    // },

    {
      name: "Monto adeudado",
      width: tableUIHelper.columns.width.amount,
      selector: (row) => row.amount_owed,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Monto Pendiente",
      width: tableUIHelper.columns.width.amount,
      selector: (row) => row.remaining_amount,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "NCF",
      width: "120px",
      selector: (row) => row.ncf,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Tipo de gasto",
      width: "400px",
      selector: (row) => row.expense_type,
      sortable: true,
      reorder: true,
      omit: false,
    },
  ]);

  const mainFilters = [
    {
      label: "Proveedor",
      field: "providerName",
      placeholder: "Búsqueda por nombre",
      type: "text",
    },
    // {
    //   label: "No. Cédula/Pasaporte",
    //   field: "identification",
    //   placeholder: "Cédula",
    //   type: "text",
    // },
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
      isActive: true,
    },
    // {
    //   label: "Estatus",
    //   field: "loanStatus",
    //   type: "select",
    //   options: [
    //     {
    //       label: "Todos",
    //       value: "",
    //     },
    //     {
    //       label: "Creado",
    //       value: "CREATED",
    //     },
    //     {
    //       label: "Pagado",
    //       value: "PAID",
    //     },
    //     {
    //       label: "Cancelado",
    //       value: "CANCEL",
    //     },
    //     {
    //       label: "Renegociado",
    //       value: "RENEGOTIATED",
    //     },
    //     {
    //       label: "Transferido",
    //       value: "TRANSFERRED",
    //     },
    //     {
    //       label: "Incobrable",
    //       value: "BAD-LOAN",
    //     },
    //     {
    //       label: "Reenganchado",
    //       value: "reenganchado",
    //     },
    //   ],
    // },
    // {
    //   label: "Tipo de préstamo",
    //   field: "loanType",
    //   type: "select",
    //   options: [
    //     {
    //       label: "Todos",
    //       value: "",
    //     },
    //     {
    //       label: "Personal",
    //       value: "LOAN_TYPE_PERSONAL",
    //     },
    //     {
    //       label: "Vehículo",
    //       value: "LOAN_TYPE_VEHICLE",
    //     },
    //     {
    //       label: "Hipotecario",
    //       value: "LOAN_TYPE_MORTGAGE",
    //     },
    //     {
    //       label: "Pymes",
    //       value: "LOAN_PYMES",
    //     },
    //     {
    //       label: "Micro",
    //       value: "LOAN_MICRO",
    //     },
    //     {
    //       label: "Seguro",
    //       value: "LOAN_INSURANCE",
    //     },
    //   ],
    // },
    // {
    //   label: "Situación",
    //   field: "loanSituation",
    //   type: "select",
    //   options: [
    //     {
    //       label: "Todos",
    //       value: "",
    //     },
    //     {
    //       label: "Normal",
    //       value: "NORMAL",
    //     },
    //     {
    //       label: "Pagado",
    //       value: "PAID",
    //     },
    //     {
    //       label: "Atraso",
    //       value: "ARREARS",
    //     },
    //     {
    //       label: "Legal",
    //       value: "legal",
    //     },
    //     {
    //       label: "Refinanciado",
    //       value: "REFINANCE",
    //     },
    //     {
    //       label: "Incautado",
    //       value: "SEIZED",
    //     },
    //   ],
    // },
  ]);
  const filterData = data.filter((item) => {
    let searchText = `providerName${item.supplier_name}identification${item.identification}loanNumber${item.loan_number_id}`;
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
        setSecondaryFilters={setSecondaryFilters}
        setRequestToggle={setReqToggle}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        setSearchedText={setSearchedText}
        columns={columns}
        setColumns={setColumns}
        exportFunction={() => exportPDF()}
      />
      <Datatable
        columns={columns}
        data={filterData}
        isLoading={isLoading}
        // marginTopPagination={100}
        // dtOptions={{
        //   expandableRows: true,
        //   expandableRowsComponent: ({ data }) => {
        //     // console.log(data);

        //     return <LoanDetailSummary data={data} />;
        //   },
        // }}
      />
      {!isLoading && filterData.length > 0 && 1 == 2 && (
        <div
          style={{
            display: "flex",
            marginTop: "-150px",
            alignItems: "center",
            fontSize: 13,
            fontWeight: "bold",
          }}
        >
          <span style={{ paddingLeft: 15 }}>Totales</span>
          <p style={{ marginLeft: 467, width: 130 }}>
            {currencyFormat(
              filterData.reduce(
                (acc, item) => acc + parseFloat(item.total_due),
                0
              )
            )}
          </p>
          <p
            style={{
              marginLeft: 50,
              width: 130,
            }}
          >
            {currencyFormat(
              filterData.reduce(
                (acc, item) => acc + parseFloat(item.total_paid_capital),
                0
              )
            )}
          </p>
          <p
            style={{
              marginLeft: 50,
              width: 130,
            }}
          >
            {currencyFormat(
              filterData.reduce(
                (acc, item) => acc + parseFloat(item.total_paid_interest),
                0
              )
            )}
          </p>
          <p
            style={{
              marginLeft: 50,
              width: 130,
            }}
          >
            {currencyFormat(
              filterData.reduce(
                (acc, item) => acc + parseFloat(item.total_paid),
                0
              )
            )}
          </p>
          <p
            style={{
              marginLeft: 50,
              width: 130,
            }}
          >
            {currencyFormat(
              filterData.reduce(
                (acc, item) => acc + parseFloat(item.total_pending || 0),
                //parseFloat(item.total_paid),
                0
              )
            )}
          </p>
        </div>
      )}
    </div>
  );
}

export { AccountPayableCrud };
