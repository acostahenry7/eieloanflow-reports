import React from "react";
import { SearchBar } from "../../SearchBar";
import { Datatable } from "../../Datatable";
import { getValidationBalance } from "../../../api/accounting";
import { formatClientName } from "../../../utils/stringFunctions";
import { getOutletsApi } from "../../../api/outlet";
import CurrencyFormat from "react-currency-format";
import { generateReport } from "../../../utils/reports/validationBalance";

function ValidationBalanceCrud() {
  const [outlets, setOutlets] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [reqToggle, setReqToggle] = React.useState([]);
  const [searchedText, setSearchedText] = React.useState("");
  const [searchParams, setSearchParams] = React.useState({
    outletId: "4a812a14-f46d-4a99-8d88-c1f14ea419f4",
    date: new Date().toISOString().split("T")[0],
  });

  React.useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const outlets = await getOutletsApi();
        const validationBalance = await getValidationBalance(searchParams);
        if (validationBalance.error == true) {
          throw new Error(validationBalance.body);
        }

        console.log(validationBalance);
        setOutlets(outlets.body);
        setData(validationBalance.body);
      } catch (error) {
        console.log(error.message);
      }
      setIsLoading(false);
    })();
  }, [reqToggle, searchParams]);

  const [columns, setColumns] = React.useState([
    {
      name: "No. Cuenta",
      width: "10%",
      selector: (row) => row.number,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Descripción",
      width: "22%",
      selector: (row) => row.name,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: (
        <div>
          <p style={{ textAlign: "center" }}>Balance anterior</p>
          <div
            style={{
              width: 250,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>Dédito</span>
            <span>Crédito</span>
          </div>
        </div>
      ),
      width: "22.6%",
      selector: (row) => (
        <div
          style={{
            width: 250,
            display: "flex",
            justifyContent: "space-between",
            textAlign: "right",
          }}
        >
          <CurrencyFormat
            value={parseFloat(row.prev_debit).toFixed(2)}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"RD$ "}
          />
          <CurrencyFormat
            value={parseFloat(row.prev_credit).toFixed(2)}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"RD$ "}
          />
        </div>
      ),
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: (
        <div>
          <p style={{ textAlign: "center" }}>Movimiento del mes</p>
          <div
            style={{
              width: 250,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>Dédito</span>
            <span>Crédito</span>
          </div>
        </div>
      ),
      width: "22.6%",
      selector: (row) => (
        <div
          style={{
            width: 250,
            display: "flex",
            justifyContent: "space-between",
            textAlign: "right",
          }}
        >
          <CurrencyFormat
            value={parseFloat(row.mov_debit).toFixed(2)}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"RD$ "}
          />
          <CurrencyFormat
            value={parseFloat(row.mov_credit).toFixed(2)}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"RD$ "}
          />
        </div>
      ),
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: (
        <div>
          <p style={{ textAlign: "center" }}>Acumulado</p>
          <div
            style={{
              width: 250,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>Dédito</span>
            <span>Crédito</span>
          </div>
        </div>
      ),
      width: "22.6%",
      selector: (row) => (
        <div
          style={{
            width: 240,
            display: "flex",
            justifyContent: "space-between",
            textAlign: "right",
          }}
        >
          <CurrencyFormat
            value={parseFloat(row.total_debit).toFixed(2)}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"RD$ "}
          />
          <CurrencyFormat
            value={parseFloat(row.total_credit).toFixed(2)}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"RD$ "}
          />
        </div>
      ),
      sortable: true,
      reorder: true,
      omit: false,
    },
  ]);

  const mainFilters = [
    {
      label: "No. Cuenta",
      field: "number",
      placeholder: "Búsqueda por no. cuenta",
      type: "text",
    },
    {
      label: "Descripción",
      field: "name",
      placeholder: "Descripción",
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
        ...outlets
          // .filter(
          //   (item) => item.outlet_id == "4a812a14-f46d-4a99-8d88-c1f14ea419f4"
          // )
          .map((item) => {
            return {
              label: item.name,
              value: item.outlet_id,
            };
          }),
      ],
    },
    {
      label: "A la Fecha De",
      field: "date",
      type: "date",
    },
  ];

  const secondaryFilters = [];

  const filterData = data.filter((item) => {
    let searchText = `number${item.number}name${item.name}`;
    return searchText.toLowerCase().includes(searchedText.toLocaleLowerCase());
  });

  const savepdf = () => {
    // let arr = data.balances.filter(
    //   (item) =>
    //     item.number[0] == "4" || item.number[0] == "5" || item.number[0] == "6"
    // );
    let reportDate = new Date(searchParams.date);
    let outletName = outlets.filter(
      (item) => item.outlet_id == searchParams.outletId
    )[0]?.name;

    let configParams = {
      title: outletName || "Todas las sucursales",
      subTitle: "BALANCE DE COMPROBACION",
      date: reportDate.toLocaleString("es-Es", {
        timeZone: "UTC",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      fixedDate: reportDate,
    };

    generateReport(filterData, configParams);
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
        exportFunction={() => savepdf()}
      />

      <Datatable columns={columns} data={filterData} isLoading={isLoading} />
    </div>
  );
}

export { ValidationBalanceCrud };
