import React from "react";
import { SearchBar } from "../../SearchBar";
import { Datatable } from "../../Datatable";
import { getCustomerLoanApi } from "../../../api/customer";
import {
  formatClientName,
  getLoanFrequencyLabel,
  getCustomerEstatusLabel,
  getLoanSituationLabel,
  getLoanTypeLabel,
} from "../../../utils/stringFunctions";
import { getOutletsApi } from "../../../api/outlet";
import { tableUIHelper } from "../../../utils/ui-helpers";
import { generateReport } from "../../../utils/reports/customerLoan";

function CustomerLoanCrud() {
  const [outlets, setOutlets] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [reqToggle, setReqToggle] = React.useState([]);
  const [searchedText, setSearchedText] = React.useState("");
  const [searchParams, setSearchParams] = React.useState({
    dateFrom: new Date().toISOString().split("T")[0],
    dateTo: new Date().toISOString().split("T")[0],
    paymentDateFrom: new Date().toISOString().split("T")[0],
    paymentDateTo: new Date().toISOString().split("T")[0],
  });

  React.useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const outlets = await getOutletsApi();
        const customers = await getCustomerLoanApi(searchParams);
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

  const [columns, setColumns] = React.useState([
    {
      name: "Cliente",
      // width: "230px",
      selector: (row) => row.customer_name.toUpperCase().trim(),
      sortable: true,
      reorder: true,
      wrap: true,
      omit: false,
    },
    {
      name: "Cédula",
      //width: tableUIHelper.columns.width.loan,
      selector: (row) => row.identification,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Estatus cliente",
      //width: tableUIHelper.columns.width.phone,
      selector: (row) => getCustomerEstatusLabel(row.status_type),
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Préstamo",
      //width: tableUIHelper.columns.width.loan,
      selector: (row) => row.loan_number_id,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Estado de préstamo",
      //width: tableUIHelper.columns.width.loan,
      selector: (row) => getLoanSituationLabel(row.loan_status),
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Tipo",
      //width: tableUIHelper.columns.width.loan,
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

    // {
    //   label: "Frequencia de pago",
    //   field: "paymentFrequency",
    //   type: "select",
    //   options: [
    //     {
    //       label: "Todos",
    //       value: "",
    //     },
    //     {
    //       label: "Semanal",
    //       value: "WEEKLY",
    //     },
    //     {
    //       label: "Inter-diario",
    //       value: "INTER_DAY",
    //     },
    //     {
    //       label: "Mensual",
    //       value: "MONTHLY",
    //     },
    //     {
    //       label: "Quincenal",
    //       value: "BEWEEKLY",
    //     },
    //     {
    //       label: "Diario",
    //       value: "DAILY",
    //     },
    //   ],
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
    {
      label: "Estatus Cliente",
      field: "customerStatus",
      type: "select",
      options: [
        {
          label: "Todos",
          value: "",
        },
        {
          label: "Activo",
          value: "ENABLED",
        },
        {
          label: "Inactivo",
          value: "DISABLED",
        },
      ],
    },
  ];

  const secondaryFilters = [
    {
      label: "Estatus Préstamo",
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
    },
  ];

  const filterData = data.filter((item) => {
    let searchText = `customerName${item.customer_name}identification${item.identification}loanNumber${item.loan_number_id}`;
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
        setRequestToggle={setReqToggle}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        setSearchedText={setSearchedText}
        columns={columns}
        setColumns={setColumns}
        exportFunction={() => exportPDF()}
      />
      <Datatable columns={columns} data={filterData} isLoading={isLoading} />
    </div>
  );
}

export { CustomerLoanCrud };
