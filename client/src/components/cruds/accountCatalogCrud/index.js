import React from "react";
import { SearchBar } from "../../SearchBar";
import { Datatable } from "../../Datatable";
import { getAccountCatalog } from "../../../api/accounting";
import { formatClientName } from "../../../utils/stringFunctions";
import { getOutletsApi } from "../../../api/outlet";
import { generateReport } from "../../../utils/reports/accountCatalog";

function AccountCatalogCrud() {
  const [outlets, setOutlets] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [reqToggle, setReqToggle] = React.useState([]);
  const [searchedText, setSearchedText] = React.useState("");
  const [searchParams, setSearchParams] = React.useState({
    outletId: "857b8b3b-d603-4474-9b35-4a90277d9bc0",
  });

  React.useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const outlets = await getOutletsApi();
        const accountCatalog = await getAccountCatalog(searchParams);
        if (accountCatalog.error == true) {
          throw new Error(accountCatalog.body);
        }
        console.log(accountCatalog.body);
        setOutlets(outlets.body);
        setData(accountCatalog.body);
      } catch (error) {
        console.log(error.message);
      }
      setIsLoading(false);
    })();
  }, [reqToggle, searchParams]);

  const [columns, setColumns] = React.useState([
    // {
    //   name: "Cliente",
    //   width: "250px",
    //   selector: (row) => (
    //     <div>
    //       <p style={{ margin: 0, fontWeight: 500 }}>
    //         {formatClientName(row.customer_name)}
    //       </p>
    //       <span style={{ fontSize: 12 }}>{row.identification}</span>
    //     </div>
    //   ),
    //   sortable: true,
    //   reorder: true,
    //   wrap: true,
    //   omit: false,
    // },
    {
      name: "Numero",
      width: "450px",
      selector: (row) => row.number,
      sortable: true,
      reorder: true,
      omit: false,
    },
    {
      name: "Nombre o descripcion",
      selector: (row) => row.name,
      sortable: true,
      reorder: true,
      omit: false,
    },
  ]);

  const mainFilters = [
    {
      label: "No. de Cuenta",
      field: "accountNumber",
      type: "text",
    },
    {
      label: "Nombre de la Cuenta",
      field: "accountName",
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
    // {
    //   label: "Fecha cancelación",
    //   field: "date",
    //   type: "dateRange",
    // },
  ];

  const filterData = data.filter((item) => {
    let searchText = `accountName${item.name}accountNumber${item.number}`;
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

export { AccountCatalogCrud };
