import React from "react";
import { SearchBar } from "../../SearchBar";
import { Datatable } from "../../Datatable";
import { getHistoryPaymentControl } from "../../../api/payment";
import { formatClientName } from "../../../utils/stringFunctions";
import { getOutletsApi } from "../../../api/outlet";
import { generateReport } from "../../../utils/reports/paymentControlHistory";
import { getZonesApi } from "../../../api/zone";
import { orderBy, uniq, uniqBy } from "lodash";

function PaymentControlHistoryCrud() {
  const [outlets, setOutlets] = React.useState([]);
  const [zones, setZones] = React.useState([]);
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
        const zones = await getZonesApi(searchParams);
        const payments = await getHistoryPaymentControl(searchParams);
        if (payments.error == true) {
          throw new Error(payments.body);
        }
        console.log("ZONES", zones);
        setOutlets(outlets.body);
        setZones([]);
        setZones(zones.body);
        setData(payments.body);
      } catch (error) {
        console.log(error.message);
      }
      setIsLoading(false);
    })();
  }, [reqToggle, searchParams]);

  // React.useEffect(() => {
  //   (async () => {
  //     console.log(searchParams.outletId);
  //     const zones = await getZonesApi(searchParams);
  //     setZones(zones.body);
  //   })();
  // }, [searchParams.outletId]);

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
      name: "Situacion",
      width: "120px",
      selector: (row) => row.loan_situation,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Empleado",
      width: "140px",
      selector: (row) => row.employee_name,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Zona",
      width: "140px",
      selector: (row) => row.zone,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Fecha comentario",
      width: "170px",
      selector: (row) => new Date(row.comment_date).toLocaleString("en-US"),
      sortable: true,
      reorder: true,
      omit: true,
    },
    {
      name: "Comentario",
      selector: (row) => row.comment,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Tipo de comentario",
      selector: (row) => row.comment_type,
      sortable: true,
      reorder: true,
      omit: true,
    },
    {
      name: "Tipo de carta",
      selector: (row) => `${row.letter_type}`,
      sortable: true,
      reorder: true,
      omit: true,
    },
    {
      name: "Fecha de compromiso",
      selector: (row) => `${row.commitment_date}`,
      sortable: true,
      reorder: true,
      omit: true,
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
      currentValue: searchParams.outletId,
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
      label: "Zona",
      field: "zoneId",
      type: "select",
      options: [
        {
          label: "Todas las zonas",
          value: "",
        },
        ...orderBy(uniqBy(zones, "name"), ["name"]).map((zone) => ({
          label: zone.name,
          value: zone.name,
        })),
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

  const filterData = data.filter((item) => {
    let searchText = `customerName${item.employee_name}indetification${item.identification}loanNumber${item.loan_number_id}`;
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

export { PaymentControlHistoryCrud };
