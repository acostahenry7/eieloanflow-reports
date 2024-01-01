import React from "react";
import { SearchBar } from "../../SearchBar";
import { Datatable } from "../../Datatable";
import { getCollectorVisitsApi } from "../../../api/payment";
import { formatClientName } from "../../../utils/stringFunctions";
import { getOutletsApi } from "../../../api/outlet";
import { generateReport } from "../../../utils/reports/collectorVisits";

function CollectorVisitsCrud() {
  const [outlets, setOutlets] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [reqToggle, setReqToggle] = React.useState([]);
  const [searchParams, setSearchParams] = React.useState([]);
  const [searchedText, setSearchedText] = React.useState("");

  React.useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const outlets = await getOutletsApi();
        const visits = await getCollectorVisitsApi(searchParams);
        if (visits.error == true) {
          throw new Error(visits.body);
        }

        setOutlets(outlets.body);
        setData(visits.body);
        console.log(visits.body);
      } catch (error) {
        console.log(error.message);
      }
      setIsLoading(false);
    })();
  }, [reqToggle, searchParams]);

  const [columns, setColumns] = React.useState([
    {
      name: "Cliente",
      width: "270px",
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
      name: "Fecha visita",
      selector: (row) => new Date(row.visit_date).toLocaleString("en-US"),
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Empleado",
      selector: (row) => row.employee,
      sortable: true,
      reorder: true,
      omit: false,
    },

    {
      name: "Comentario",
      selector: (row) => row.actual_location,
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
      field: "indetification",
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

  const secondaryFilters = [
    {
      label: "Fecha",
      field: "date",
      placeholder: "Búsqueda por nombre",
      type: "dateRange",
    },
  ];

  const exportPDF = () => {
    generateReport(data, {});
  };

  const filterData = data.filter((item) => {
    let searchText = `customerName${item.customer_name}indetification${item.identification}loanNumber${item.loan_number_id}`;
    return searchText.toLowerCase().includes(searchedText.toLocaleLowerCase());
  });

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

export { CollectorVisitsCrud };
