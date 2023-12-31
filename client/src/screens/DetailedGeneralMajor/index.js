import React from "react";
import { TopBar } from "../../components/TopBar";
//import { generate607Api } from "../../api/accounting";
import { ThreeDots } from "react-loader-spinner";
import "./index.css";
import { getMajorGeneral } from "../../api/accounting";
import { generateReport } from "../../utils/reports/majorGeneral";
import { SearchBar } from "../../components/SearchBar";
import { getOutletsApi } from "../../api/outlet";

function DetailedGeneralMajor() {
  const [outlets, setOutlets] = React.useState([]);
  const [data, setData] = React.useState({});
  const [accounts, setAccounts] = React.useState([]);
  const [searchParams, setSearchParams] = React.useState({
    outletId: "4a812a14-f46d-4a99-8d88-c1f14ea419f4",
    accountId: "110",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [reqToggle, setReqToggle] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      try {
        const outlets = await getOutletsApi({});
        setOutlets(outlets.body);
        setAccounts([]);

        let response = await getMajorGeneral(searchParams);
        let accountList = Object.entries(response.body)
          .sort()
          .map((item) => ({
            number: item[0],
            name: item[1][0].name,
          }));

        setAccounts(accountList);
        setData(response.body);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [reqToggle]);

  const generateMajorGeneral = async () => {
    try {
      setIsLoading(true);

      let reportData = {
        [searchParams.accountId]: data[searchParams.accountId],
      };
      generateReport(reportData, {});
      setIsLoading(false);
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
      label: "Cuenta",
      field: "accountId",
      type: "select",
      updateForm: true,
      options: [
        ...accounts?.map((item) => {
          return {
            label: `${item.number} ${item.name}`,
            value: `${item.number}`,
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
      <TopBar title="Mayor General Detallado" />
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

export { DetailedGeneralMajor };
