import React from "react";
import { TopBar } from "../../components/TopBar";
import { generate606Api } from "../../api/accounting";
import { ThreeDots } from "react-loader-spinner";
import { SearchBar } from "../../components/SearchBar";
import { getOutletsApi } from "../../api/outlet";
import "./index.css";

function DGI606Screen() {
  const [searchParams, setSearchParams] = React.useState({
    dateYear: new Date().getFullYear(),
    dateMonth: new Date().getMonth(),
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

  const [lastYears, setLastYears] = React.useState([]);
  const [lastMonths, setLastMonths] = React.useState([]);
  let months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  React.useEffect(() => {
    (() => {
      let currentYear = parseInt(
        new Date().toISOString().split("T")[0].split("-")[0]
      );

      let arr = [];
      let arr2 = [];
      for (let i = 0; i < 10; i++) {
        arr.push({
          label: currentYear,
          value: currentYear,
        });

        currentYear -= 1;
      }
      for (let i = 0; i < 12; i++) {
        arr2.push({
          label: `${months[i]}`,
          value: i + 1,
        });
      }
      setLastYears(arr);
      setLastMonths(arr2);
    })();
  }, []);

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
        {
          label: "Todas las sucursales",
          value: undefined,
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
      label: "Año",
      field: "dateYear",
      type: "select",
      options: [, /*{ label: "Todas los años", value: "" }*/ ...lastYears],
    },
    {
      label: "Mes",
      field: "dateMonth",
      type: "select",
      options: [
        ,
        /*{ label: "Todas las sucursales", value: "" }*/ ...lastMonths,
      ],
    },
    // {
    //   label: "A la Fecha De",
    //   field: "date",
    //   type: "date",
    // },
  ];
  //

  let secondaryFilters = [
    // {
    //   label: "Fecha",
    //   field: "date",
    //   placeholder: "Búsqueda por nombre",
    //   type: "dateRange",
    // },
  ];

  console.log(searchParams);

  return (
    <div className="">
      <TopBar title="Formulario 606" />
      <div className="screen-content">
        <SearchBar
          searchParams={searchParams}
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
