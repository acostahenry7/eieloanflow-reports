import React from "react";
import { TopBar } from "../../components/TopBar";
//import { generate607Api } from "../../api/accounting";
import { ThreeDots } from "react-loader-spinner";
import "./index.css";
import { getMajorGeneral } from "../../api/accounting";
import { generateReport } from "../../utils/reports/majorGeneral";
import { SearchBar } from "../../components/SearchBar";
import { getOutletsApi } from "../../api/outlet";

function GeneralMajor() {
  const [outlets, setOutlets] = React.useState([]);
  const [searchParams, setSearchParams] = React.useState({
    outletId: "4a812a14-f46d-4a99-8d88-c1f14ea419f4",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [reqToggle, setReqToggle] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      try {
        const outlets = await getOutletsApi({});
        setOutlets(outlets.body);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [reqToggle, searchParams]);

  const generateMajorGeneral = async () => {
    console.log(searchParams);
    try {
      setIsLoading(true);
      let response = await getMajorGeneral(searchParams);

      let reportConfig = {
        title: outlets.filter(
          (item) => item.outlet_id == searchParams.outletId
        )[0].name,
        date: `De ${new Date(searchParams.dateFrom)
          .toUTCString()
          .slice(5, 16)} al ${new Date(searchParams.dateTo)
          .toUTCString()
          .slice(5, 16)}`,
      };
      //generateReport(response.body, reportConfig);
      setIsLoading(false);

      console.log(response);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
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
  ];

  let secondaryFilters = [
    {
      label: "Fecha",
      field: "date",
      placeholder: "Búsqueda por nombre",
      type: "dateRange",
    },
  ];

  return (
    <div className="">
      <TopBar title="Mayor General" />
      <div className="screen-content">
        <SearchBar
          mainFilters={mainFilters}
          secondaryFilters={secondaryFilters}
          setSearchParams={setSearchParams}
          setRequestToggle={setReqToggle}
        />
        <button
          className="btn"
          onClick={async () => await generateMajorGeneral()}
        >
          Generar
        </button>
        {isLoading && <ThreeDots />}
      </div>
    </div>
  );
}

export { GeneralMajor };
