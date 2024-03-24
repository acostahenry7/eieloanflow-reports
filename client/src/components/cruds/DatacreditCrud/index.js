import React from "react";
import { SearchBar } from "../../SearchBar";
import { Datatable } from "../../Datatable";
import {
  generateDatacredit,
  getDatacreditLoans,
  getLoanDetail,
  getLoans,
} from "../../../api/loan";
import {
  formatClientName,
  getLoanSituationLabel,
  getLoanTypeLabel,
} from "../../../utils/stringFunctions";
import { getOutletsApi } from "../../../api/outlet";
import { ThreeDots } from "react-loader-spinner";
import "./index.css";
import { currencyFormat } from "../../../utils/reports/report-helpers";
import { generateReport } from "../../../utils/reports/loanDetail";

function DatacreditCrud() {
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
        const customers = await getDatacreditLoans(searchParams);
        if (customers.error == true) {
          throw new Error(customers.body);
        }
        console.log(customers.body);
        setOutlets(outlets.body);
        setData(customers.body);
      } catch (error) {
        console.log(error.message);
      }
      setIsLoading(false);
    })();
  }, [reqToggle, searchParams]);

  // React.useEffect(() => {
  //   (async () => {
  //     const res = await getLoanDetail(data.loan_id);
  //     setDetailedData(res);
  //   })();
  // }, [toggleExpandable]);

  console.log("hola", searchParams);

  const [columns, setColumns] = React.useState([
    {
      name: "Cliente",
      width: "250px",
      selector: (row) => (
        <div>
          <p style={{ margin: 0, fontWeight: 500 }}>
            {formatClientName(row.customer_name)}
          </p>
          <span style={{ fontSize: 12 }}>{row.identification}</span>
        </div>
      ),
      sortable: true,
      reorder: true,
      wrap: true,
      omit: false,
    },
    {
      name: "Préstamo",
      width: "120px",
      selector: (row) => row.loan_number_id,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Direccion",
      width: "240px",
      selector: (row) => row.customer_address,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Telefono 1",
      width: "140px",
      selector: (row) => row.phone,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Teléfono 2",
      width: "140px",
      selector: (row) => row.mobile,
      sortable: true,
      reorder: true,
      omit: true,
    },
    {
      name: "Fecha apertura",
      selector: (row) => new Date(row.created_date).toLocaleDateString("es-ES"),
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Monto aprobado",
      selector: (row) => row.amount_approved,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Monto de cuota",
      selector: (row) => row.amount_of_free,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Estatus",
      selector: (row) => getLoanSituationLabel(row.status_type),
      sortable: true,
      reorder: true,
      omit: false,
      hide: "lg",
    },
    {
      name: "Situación",
      selector: (row) => getLoanSituationLabel(row.loan_situation),
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Tipo de préstamo",
      selector: (row) => getLoanTypeLabel(row.loan_type),
      sortable: true,
      reorder: true,
      omit: false,
    },
  ]);

  const mainFilters = [
    {
      label: "Cliente",
      field: "customerName",
      placeholder: "Búsqueda por nombre",
      type: "text",
    },
    {
      label: "No. Cédula/Pasaporte",
      field: "identification",
      placeholder: "Cédula",
      type: "text",
    },
    {
      label: "No. Préstamo",
      field: "loanNumber",
      placeholder: "No. Préstamo",
      type: "text",
    },
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
    {
      label: "Estatus",
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
    {
      label: "Tipo de préstamo",
      field: "loanType",
      type: "select",
      options: [
        {
          label: "Todos",
          value: "",
        },
        {
          label: "Personal",
          value: "LOAN_TYPE_PERSONAL",
        },
        {
          label: "Vehículo",
          value: "LOAN_TYPE_VEHICLE",
        },
        {
          label: "Hipotecario",
          value: "LOAN_TYPE_MORTGAGE",
        },
        {
          label: "Pymes",
          value: "LOAN_PYMES",
        },
        {
          label: "Micro",
          value: "LOAN_MICRO",
        },
        {
          label: "Seguro",
          value: "LOAN_INSURANCE",
        },
      ],
      isActive: true,
    },
    {
      label: "Situación",
      field: "loanSituation",
      type: "select",
      options: [
        {
          label: "Todos",
          value: "",
        },
        {
          label: "Normal",
          value: "NORMAL",
        },
        {
          label: "Pagado",
          value: "PAID",
        },
        {
          label: "Atraso",
          value: "ARREARS",
        },
        {
          label: "Legal",
          value: "legal",
        },
        {
          label: "Refinanciado",
          value: "REFINANCE",
        },
        {
          label: "Incautado",
          value: "SEIZED",
        },
      ],
      isActive: true,
    },
  ]);
  const filterData = data.filter((item) => {
    let searchText = `customerName${item.customer_name}identification${item.identification}loanNumber${item.loan_number_id}`;
    return searchText.toLowerCase().includes(searchedText.toLocaleLowerCase());
  });

  const exportPDF = async () => {
    console.log("hi");
    // let reportDate = new Date(searchParams.dateTo);

    // let outletName = outlets.filter(
    //   (item) => item.outlet_id == searchParams.outletId
    // )[0]?.name;
    // let conf = {
    //   title: outletName || "Todas las sucursales",
    //   date: reportDate.toLocaleString("es-Es", {
    //     timeZone: "UTC",
    //     year: "numeric",
    //     month: "long",
    //     day: "numeric",
    //   }),
    // };
    // generateReport(filterData, conf);
    try {
      let res = await generateDatacredit(searchParams);

      if (res.error == true) {
        throw new Error(res.body);
      }
    } catch (error) {
      console.log(error);
    }
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
        exportFunction={async () => await exportPDF()}
      />
      <Datatable
        columns={columns}
        data={filterData}
        isLoading={isLoading}
        // dtOptions={{
        //   expandableRows: true,
        //   expandableRowsComponent: ({ data }) => {
        //     // console.log(data);

        //     return <LoanDetailSummary data={data} />;
        //   },
        // }}
      />
    </div>
  );
}

function getDetailedData() {}

function LoanDetailSummary({ data }) {
  const [detail, setDetail] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      setIsLoading(true);
      const res = await getLoanDetail(data.loan_id);
      setIsLoading(false);
      console.log(res);
      setDetail(res.body[0]);
    })();
  }, [data]);

  console.log(detail);
  const fields = [
    "Préstamo",
    "Fecha de Creación",
    "Nombre Cliente",
    "Cédula",
    "Tipo de tasa",
    "Monto aprobado",
    "Número de cuotas",
    "Tasa Mora",
    "Frecuencia de pago",
    "Tipo de mora",
    "Estado",
    "Situación",
    "Tipo de préstamo",
    "Capital pagado",
    "Interés pagado",
    "Descuento de interés",
    "Descuento de mora",
    "Mora",
    "Mora pagada",
    "Total pagado",
    "Total en atraso",
    "Cuotas pagadas",
    "Total",
    "Tasa Interés",
    "Interés",
    "Monto de cuota",
    "Monto pendiente",
    "Capital pendiente",
    "Interés pendiente",
    "Mora pendiente",
    "Gastos",
    "Cuotas pendientes",
    "Cuotas en atraso",
    "Sucursal",
  ];

  return (
    <div className="LoanDetailSummary-container">
      {isLoading && <ThreeDots width={36} color="#166fd7" />}
      {Object.entries(detail)?.map((item, index) => (
        <div className="LoanDetailSummary-item">
          <p>{fields[index] || "key"} :</p>
          <p>
            {" "}
            {currencyFormat(item[1]).toLocaleLowerCase().includes("nan") ||
            fields[index].toLowerCase().includes("cuotas") ||
            fields[index].toLowerCase().includes("tasa") ||
            fields[index].toLowerCase().includes("préstamo")
              ? fields[index].toLowerCase().includes("tasa interés")
                ? item[1].toFixed(1)
                : fields[index].toLowerCase().includes("fecha")
                ? new Date(item[1]).toLocaleString("es-Es").split(",")[0]
                : item[1]
              : currencyFormat(item[1])}
            {fields[index].toLowerCase().includes("tasa") && "%"}
          </p>
        </div>
      ))}
    </div>
  );
}

export { DatacreditCrud };
