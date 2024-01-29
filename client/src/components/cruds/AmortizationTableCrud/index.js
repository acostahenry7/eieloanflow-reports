import React from "react";
import { SearchBar } from "../../SearchBar";
import { Datatable } from "../../Datatable";
import {
  formatClientName,
  getLoanSituationLabel,
} from "../../../utils/stringFunctions";
import { getOutletsApi } from "../../../api/outlet";
import { generateReport } from "../../../utils/reports/amortizationTable";
import { getAmortizationTable } from "../../../api/loan";

function AmortizationTableCrud() {
  const [outlets, setOutlets] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [reqToggle, setReqToggle] = React.useState([]);
  const [searchedText, setSearchedText] = React.useState("");
  const [searchParams, setSearchParams] = React.useState({
    dateFrom: new Date().toISOString().split("T")[0],
    dateTo: new Date().toISOString().split("T")[0],
  });

  React.useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const outlets = await getOutletsApi();
        const amortization = await getAmortizationTable(searchParams);
        if (amortization.error == true) {
          throw new Error(amortization.body);
        }

        console.log(amortization.body);
        setOutlets(outlets.body);
        setData(amortization.body);
      } catch (error) {
        console.log(error.message);
      }
      setIsLoading(false);
    })();
  }, [reqToggle, searchParams]);

  const [columns, setColumns] = React.useState([
    {
      name: "No. cuota",
      selector: (row) => row.quota_number,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Fecha de pago",
      selector: (row) => new Date(row.payment_date).toLocaleDateString("es-DO"),
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Capital",
      selector: (row) => row.capital,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Interés",
      selector: (row) => row.interest,
      sortable: true,
      reorder: true,
      omit: false,
    },

    {
      name: "Cuota",
      selector: (row) => row.amount_of_fee,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Balance capital",
      selector: (row) => row.balance_of_capital,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Mora",
      selector: (row) => row.mora,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Mora Pagada",
      selector: (row) => row.total_paid_mora,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Descuento",
      selector: (row) => row.discount_interest + row.discount_mora,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Total pagado",
      selector: (row) => row.total_paid,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Pendiente",
      selector: (row) => row.total_paid,
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
    },
  ]);

  const mainFilters = [
    {
      label: "No. Préstamo",
      field: "loanNumber",
      isNotDynamic: true,
      placeholder: "Campo obligatorio",
      type: "text",
    },
  ];

  const secondaryFilters = [];

  const filterData = data.filter((item) => {
    let searchText = `customerName${item.customer_name}indetification${item.identification}loanNumber${item.loan_number_id}pendingDue${item.pending_due}`;
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

export { AmortizationTableCrud };
