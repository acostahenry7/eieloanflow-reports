import React from "react";
import { SearchBar } from "../../SearchBar";
import { Datatable } from "../../Datatable";
import { getLoanDiscounts } from "../../../api/loan";
import { formatClientName } from "../../../utils/stringFunctions";
import { getOutletsApi } from "../../../api/outlet";
import { generateReport } from "../../../utils/reports/loanDiscount";

function LoanDiscountsCrud() {
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
        const loanDiscounts = await getLoanDiscounts(searchParams);
        if (loanDiscounts.error == true) {
          throw new Error(loanDiscounts.body);
        }

        setOutlets(outlets.body);
        console.log(loanDiscounts.body);

        // console.log("PARSED DATA", parseData);
        setData(loanDiscounts.body);
      } catch (error) {
        console.log(error.message);
      }
      setIsLoading(false);
    })();
  }, [reqToggle, searchParams]);

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
      name: "Cuota",
      width: "120px",
      selector: (row) => row.quota_number,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Tipo de descuento ",
      selector: (row) =>
        (() => {
          let status = "";

          switch (row.discount_type) {
            case "MORA":
              status = "Mora";
              break;
            case "INTEREST":
              status = "Interés";
              break;
            default:
              break;
          }

          return status;
        })(),
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Nota/comentario",
      selector: (row) => row.commentary,
      sortable: true,
      reorder: true,
      omit: false,
      width: "250px",
    },
    {
      name: "Empleado",
      selector: (row) => row.employee_name,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Fecha ",
      selector: (row) => new Date(row.created_date).toLocaleString("en-US"),
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Estado ",
      selector: (row) =>
        (() => {
          let status = "";

          switch (row.status_type) {
            case "CREATED":
              status = "Creado";
              break;
            case "DELETE":
              status = "Eliminado";
              break;

            default:
              break;
          }

          return status;
        })(),
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
      label: "Tipo de descuento",
      field: "discountType",
      placeholder: "Búsqueda por acción",
      type: "select",
      options: [
        {
          label: "Todos (No globales)",
          value: "",
        },
        {
          label: "Mora",
          value: "MORA",
        },
        {
          label: "Interés",
          value: "INTEREST",
        },
        {
          label: "Globales",
          value: "GLOBAL",
        },
      ],
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

  const [secondaryFilters, setSecondaryFilters] = React.useState([
    {
      label: "Fecha",
      field: "date",
      placeholder: "Búsqueda por nombre",
      type: "dateRange",
      isActive: true,
    },
    {
      label: "Empleado",
      placeholder: "Empleado",
      field: "employeeName",
      type: "text",
      isActive: true,
    },
    // {
    //   label: "Recibo",
    //   placeholder: "número recibo",
    //   field: "receiptNumber",
    //   type: "text",
    // },
  ]);

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

    generateReport(data, conf);
  };

  const filterData = data.filter((item) => {
    let searchText = `customerName${item.customer_name}indetification${item.identification}loanNumber${item.loan_number_id}
    createdBy${item.created_by}receiptNumber${item.receipt_number}actionType${item.action_type}employeeName${item.employee_name}`;
    return searchText.toLowerCase().includes(searchedText.toLocaleLowerCase());
  });

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

export { LoanDiscountsCrud };
