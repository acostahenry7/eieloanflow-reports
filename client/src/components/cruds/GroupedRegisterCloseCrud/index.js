import React from "react";
import { SearchBar } from "../../SearchBar";
import { Datatable } from "../../Datatable";
import { getGroupRegisterClose } from "../../../api/payment";
import { formatClientName } from "../../../utils/stringFunctions";
import { getOutletsApi } from "../../../api/outlet";
import { generateReport } from "../../../utils/reports/groupedRegisterClose";
import { currencyFormat } from "../../../utils/reports/report-helpers";

function GroupedRegisterClose() {
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
        const employees = await getGroupRegisterClose(searchParams);
        if (employees.error == true) {
          throw new Error(employees.body);
        }

        console.log(employees.body);
        setOutlets(outlets.body);
        setData(employees.body);
      } catch (error) {
        console.log(error.message);
      }
      setIsLoading(false);
    })();
  }, [reqToggle, searchParams]);

  const [columns, setColumns] = React.useState([
    {
      name: "Empleado",
      width: "230px",
      selector: (row) => (
        <div>
          <p style={{ margin: 0, fontWeight: 500 }}>
            {formatClientName(row.employee_name)}
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
      name: "No. Transacciones",
      selector: (row) => row.transactions,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Monto",
      selector: (row) => currencyFormat(row.pay),
      sortable: true,
      reorder: true,
      omit: false,
    },

    {
      name: "Sucursal",
      selector: (row) => row.outlet,
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
      label: "Fecha de pago",
      field: "date",
      placeholder: "Búsqueda por nombre",
      type: "dateRange",
      from: new Date().toISOString().split("T")[0],
      to: new Date().toISOString().split("T")[0],
      isActive: true,
    },
  ]);

  const filterData = data.filter((item) => {
    let searchText = `employeeName${item.employee_name}`;
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

export { GroupedRegisterClose };
