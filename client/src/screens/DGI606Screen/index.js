import React from "react";
import { TopBar } from "../../components/TopBar";
import { generate606Api } from "../../api/accounting";
import { ThreeDots } from "react-loader-spinner";
import { SearchBar } from "../../components/SearchBar";
import { getOutletsApi } from "../../api/outlet";
import "./index.css";

function DGI606Screen() {
  const [searchParams, setSearchParams] = React.useState({
    outletId: "4a812a14-f46d-4a99-8d88-c1f14ea419f4",
    date: new Date().toISOString().split("T")[0],
  });
  const [reqToggle, setReqToggle] = React.useState([]);
  const [outlets, setOutlets] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const outlets = await getOutletsApi();
        setOutlets(outlets.body);

        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    })();
  }, [reqToggle, searchParams]);

  let lastYears = [];
  for (let i = 0; i < 10; i++) {}

  const generate606Report = async () => {
    console.log("hi");
    try {
      setIsLoading(true);
      let response = await generate606Api(searchParams);
      setIsLoading(false);

      console.log(response);
    } catch (error) {}
  };

  let mainFilters = [
    {
      label: "Sucursal",
      field: "outletId",
      type: "select",
      options: [
        // {
        //   label: "Todas las sucursales",
        //   value: "",
        // },
        ...outlets.map((item) => {
          return {
            label: item.name,
            value: item.outlet_id,
          };
        }),
      ],
    },
    {
      label: "Año",
      field: "dateYear",
      type: "select",
      options: [],
    },
    // {
    //   label: "A la Fecha De",
    //   field: "date",
    //   type: "date",
    // },
  ];

  let secondaryFilters = [
    // {
    //   label: "Fecha",
    //   field: "date",
    //   placeholder: "Búsqueda por nombre",
    //   type: "dateRange",
    // },
  ];

  return (
    <div className="">
      <TopBar title="Formulario 606" />
      <div className="screen-content">
        <SearchBar
          mainFilters={mainFilters}
          secondaryFilters={secondaryFilters}
          setSearchParams={setSearchParams}
          setRequestToggle={setReqToggle}
          exportFunction={async () => await generate606Report()}
        />
        {/* <button className="btn" onClick={async () => await generate606Report()}>
          Generar
        </button> */}
        {isLoading && <ThreeDots />}
      </div>
    </div>
  );
}

export { DGI606Screen };
