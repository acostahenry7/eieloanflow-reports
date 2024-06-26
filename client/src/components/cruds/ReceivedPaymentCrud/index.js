import React, { useRef } from "react";
import { SearchBar } from "../../SearchBar";
import { Datatable } from "../../Datatable";
import { getReceivedPaymentsApi } from "../../../api/payment";
import { formatClientName } from "../../../utils/stringFunctions";
import { getOutletsApi } from "../../../api/outlet";
import { Margin, usePDF } from "react-to-pdf";
import { useReactToPrint } from "react-to-print";
import { generateReport } from "../../../utils/reports/receivedPayments";

function ReceivedPaymentCrud() {
  const [outlets, setOutlets] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [reqToggle, setReqToggle] = React.useState([]);
  const [searchedText, setSearchedText] = React.useState("");
  const [isPrinting, setIsPrinting] = React.useState(false);
  const [searchParams, setSearchParams] = React.useState({
    dateFrom: new Date().toISOString().split("T")[0],
    dateTo: new Date().toISOString().split("T")[0],
  });

  React.useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const outlets = await getOutletsApi();
        const customers = await getReceivedPaymentsApi(searchParams);
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
      name: "Recibo",
      width: "140px",
      selector: (row) => row.receipt_number,
      sortable: true,
      reorder: true,
      omit: false,
    },

    {
      name: "Cajero",
      selector: (row) => row.created_by,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Tipo de pago",
      selector: (row) =>
        (() => {
          let paymentType = "";
          switch (row.payment_type) {
            case "CASH":
              paymentType = "Efectivo";
              break;
            case "TRANSFER":
              paymentType = "Transferencia";
              break;
            case "CHECK":
              paymentType = "Cheque";
              break;

            default:
              break;
          }

          return paymentType;
        })(),
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Fecha recibo",
      selector: (row) => new Date(row.created_date).toLocaleDateString("es-DO"),
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Cuotas pagadas",
      selector: (row) =>
        row.paid_dues
          ?.split(",")
          .map((i) => parseInt(i))
          .sort(function (a, b) {
            return a - b;
          })
          .join(","),
      sortable: true,
      reorder: true,
      width: "200px",
      wrap: true,
      omit: false,
    },
    {
      name: "Abono a cuota",
      selector: (row) => row.compost_dues,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Descuento",
      selector: (row) => row.discount,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Mora pagada",
      selector: (row) => row.total_paid_mora,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Monto",
      selector: (row) => row.pay,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Estado",
      selector: (row) =>
        row.status_type === "CANCEL" ? "Cancelado" : "Activo",
      sortable: true,
      reorder: true,
      omit: true,
      hide: "lg",
    },
    {
      name: "Pagado desde",
      selector: (row) => row.payment_origin,
      sortable: true,
      reorder: true,
      omit: true,
      hide: "lg",
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

  const [secondaryFilters, setSecondaryFilters] = React.useState([
    {
      label: "Fecha",
      field: "date",
      placeholder: "Búsqueda por nombre",
      type: "dateRange",
      isActive: true,
    },
    {
      label: "Cajero",
      placeholder: "cajero",
      field: "createdBy",
      type: "text",
      isActive: true,
    },
    {
      label: "Recibo",
      placeholder: "número recibo",
      field: "receiptNumber",
      type: "text",
      isActive: true,
    },
  ]);

  const filterData = data.filter((item) => {
    let searchText = `customerName${item.customer_name}indetification${item.identification}loanNumber${item.loan_number_id}createdBy${item.created_by}receiptNumber${item.receipt_number}`;
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

export { ReceivedPaymentCrud };
