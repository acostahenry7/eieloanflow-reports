import React from "react";
import { SearchBar } from "../../SearchBar";
import { Datatable } from "../../Datatable";
import { getEmployees } from "../../../api/rrhh";
import { formatClientName } from "../../../utils/stringFunctions";
import { getOutletsApi } from "../../../api/outlet";
import { tableUIHelper } from "../../../utils/ui-helpers";
import { generateReport } from "../../../utils/reports/employee";
import { currencyFormat } from "../../../utils/reports/report-helpers";

function EmployeeCrud() {
  const [outlets, setOutlets] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [reqToggle, setReqToggle] = React.useState([]);
  const [searchedText, setSearchedText] = React.useState("");
  const [searchParams, setSearchParams] = React.useState({
    // dateFrom: new Date().toISOString().split("T")[0],
    // dateTo: new Date().toISOString().split("T")[0],
    paymentDateFrom: new Date().toISOString().split("T")[0],
    paymentDateTo: new Date().toISOString().split("T")[0],
  });

  React.useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const outlets = await getOutletsApi();
        const employees = await getEmployees(searchParams);
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
      name: "Departamento",
      width: tableUIHelper.columns.width.description,
      selector: (row) => row.department,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Cargo",
      width: tableUIHelper.columns.width.description,
      selector: (row) => row.position,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Salario",
      selector: (row) => currencyFormat(row.salary),
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Teléfono",
      width: tableUIHelper.columns.width.phone,
      selector: (row) => row.phone,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Fecha Ingreso",
      width: tableUIHelper.columns.width.date,
      selector: (row) => new Date(row.date_of_hire).toLocaleDateString("es-DO"),
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Correo",
      selector: (row) => row.email,
      sortable: true,
      reorder: true,
      omit: true,
    },
    {
      name: "Sexo",
      selector: (row) => (row.sex == "MALE" ? "Hombre" : "Mujer"),
      sortable: true,
      reorder: true,
      omit: false,
    },

    {
      name: "Fecha Nacimiento",
      selector: (row) => new Date(row.birth_date).toLocaleDateString("es-DO"),
      sortable: true,
      reorder: true,
      omit: true,
    },
    {
      name: "Fecha de desvinculación",
      selector: (row) =>
        row.departure_date
          ? new Date(row.departure_date).toLocaleDateString("es-DO")
          : "",
      sortable: true,
      reorder: true,
      omit: true,
    },
    {
      name: "Estatus",
      selector: (row) => (row.status_type == "ENABLED" ? "Activo" : "Inactivo"),
      sortable: true,
      reorder: true,
      omit: false,
    },
    // {
    //   name: "Monto cuota",
    //   selector: (row) => row.amount_of_free,
    //   sortable: true,
    //   reorder: true,
    //   omit: false,
    //   hide: "lg",
    // },
    // {
    //   name: "Cuotas",
    //   width: tableUIHelper.columns.width.fee,
    //   selector: (row) => (
    //     <p style={{ textAlign: "start" }}>{row.number_of_installments}</p>
    //   ),
    //   sortable: true,
    //   reorder: true,
    //   omit: false,
    //   hide: "lg",
    // },
    // {
    //   name: "C. Pagadas",
    //   width: tableUIHelper.columns.width.fee,
    //   selector: (row) => row.paid_dues,
    //   sortable: true,
    //   reorder: true,
    //   omit: false,
    //   hide: "lg",
    // },
    // {
    //   name: "C. atraso",
    //   width: tableUIHelper.columns.width.fee,
    //   selector: (row) => row.arrears_dues,
    //   sortable: true,
    //   reorder: true,
    //   omit: false,
    //   hide: "lg",
    // },
    // {
    //   name: "Porcentaje atraso",
    //   selector: (row) => (
    //     <p
    //       style={{
    //         color:
    //           parseFloat(row.arrear_percentaje) > 50 ? "#b25353" : "#d7a12a",
    //         fontWeight: "bold",
    //       }}
    //     >
    //       {parseFloat(row.arrear_percentaje).toFixed(2)} %
    //     </p>
    //   ),
    //   sortable: true,
    //   sortFunction: (rowA, rowB) => {
    //     const a = parseFloat(rowA.arrear_percentaje) || 0;
    //     const b = parseFloat(rowB.arrear_percentaje) || 0;

    //     if (a > b) {
    //       return 1;
    //     }

    //     if (b > a) {
    //       return -1;
    //     }

    //     return 0;
    //   },
    //   reorder: true,
    //   omit: false,
    // },
    // {
    //   name: "Vencido desde",
    //   width: tableUIHelper.columns.width.date,
    //   selector: (row) =>
    //     new Date(row.defeated_since).toLocaleDateString("es-DO"),
    //   sortable: true,
    //   reorder: true,
    //   omit: false,
    // },
    // {
    //   name: "Monto Vencido",
    //   selector: (row) => row.defeated_amount,
    //   sortable: true,
    //   reorder: true,
    //   omit: false,
    // },
  ]);

  const mainFilters = [
    {
      label: "Empleado",
      field: "employeeName",
      placeholder: "Búsqueda por nombre",
      type: "text",
    },
    {
      label: "No. Cédula/Pasaporte",
      field: "identification",
      placeholder: "Cédula",
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
      label: "Fecha de Ingreso",
      field: "date",
      type: "dateRange",
    },
    // {
    //   label: "Cuotas en atraso",
    //   field: "arrearFees",
    //   placeholder: "Ej. 2",
    //   isNotDynamic: true,
    //   type: "text",
    // },
  ];

  const filterData = data.filter((item) => {
    let searchText = `employeeName${item.customer_name}identification${item.identification}loanNumber${item.loan_number_id}`;
    return searchText.toLowerCase().includes(searchedText.toLocaleLowerCase());
  });

  const exportPDF = () => {
    let reportDate = searchParams.dateTo
      ? new Date(searchParams.dateTo)
      : new Date();

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

export { EmployeeCrud };
