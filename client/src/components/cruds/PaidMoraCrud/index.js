import React from "react";
import { SearchBar } from "../../SearchBar";
import { Datatable } from "../../Datatable";
import { getPaidMora } from "../../../api/payment";
import { formatClientName } from "../../../utils/stringFunctions";
import { getOutletsApi } from "../../../api/outlet";
import { generateReport } from "../../../utils/reports/paidMora";
import { currencyFormat } from "../../../utils/reports/report-helpers";
import { TotalBar } from "../../TotalBar";
import CurrencyFormat from "react-currency-format";
import { tableUIHelper } from "../../../utils/ui-helpers";

function PaidMoraCrud() {
  const [outlets, setOutlets] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [reqToggle, setReqToggle] = React.useState([]);
  const [searchedText, setSearchedText] = React.useState("");
  const [searchParams, setSearchParams] = React.useState({
    outletId: "857b8b3b-d603-4474-9b35-4a90277d9bc0",
    dateFrom: new Date().toISOString().split("T")[0],
    dateTo: new Date().toISOString().split("T")[0],
  });

  React.useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const outlets = await getOutletsApi();
        const paidMora = await getPaidMora(searchParams);
        if (paidMora.error == true) {
          throw new Error(paidMora.body);
        }
        console.log(paidMora.body);
        setOutlets(outlets.body);

        setData(paidMora.body);
      } catch (error) {
        console.log(error.message);
      }
      setIsLoading(false);
    })();
  }, [reqToggle, searchParams]);

  console.log(searchParams);

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
      width: "524px",
      selector: (row) => row.loan_number_id,
      sortable: true,
      reorder: true,
      omit: false,
    },

    // {
    //   name: "Fecha Mora Acumulada",
    //   width: "400px",
    //   selector: (row) =>
    //     new Date(searchParams.dateFrom).toLocaleString("en-US"),
    //   sortable: true,
    //   reorder: true,
    //   omit: false,
    // },
    {
      name: "Mora Pagada",
      width: "300px",
      selector: (row) => currencyFormat(row.paid_mora),
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Descuento Mora",
      width: tableUIHelper.columns.width.amount,
      selector: (row) => currencyFormat(row.discount_mora),
      sortable: true,
      reorder: true,
      omit: false,
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
      label: "Fecha cancelación",
      field: "date",
      type: "dateRange",
      isActive: true,
    },
  ]);

  const filterData = data.filter((item) => {
    let searchText = `customerName${item.customer_name}indetification${item.identification}loanNumber${item.loan_number_id}`;
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
      <Datatable
        columns={columns}
        data={filterData}
        isLoading={isLoading}
        marginTopPagination={80}
      />
      {filterData.length > 0 && (
        <div
          style={{
            display: isLoading ? "none" : "flex",
            alignItems: "center",
            marginTop: "-130px",
            // justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div>Total</div>
          <div className="list-container">
            <ul
              style={{
                display: "flex",
                marginLeft: "240px",
                // width: "100%",
                // paddingLeft: 200,
                // boxSizing: "border-box",
                // width: "70%",
                // justifyContent: "flex-start",
              }}
            >
              <li
                style={{
                  fontWeight: "bold",
                  fontSize: 12,
                  marginLeft: "477px",
                }}
              >
                <CurrencyFormat
                  value={filterData
                    .reduce((acc, item) => acc + parseFloat(item.paid_mora), 0)
                    .toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"RD$"}
                />
              </li>

              <li
                style={{
                  fontWeight: "bold",
                  fontSize: 12,
                  marginLeft: "216px",
                }}
              >
                <CurrencyFormat
                  value={data
                    .reduce(
                      (acc, item) => acc + parseFloat(item.discount_mora),
                      0
                    )
                    .toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"RD $"}
                />
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export { PaidMoraCrud };
