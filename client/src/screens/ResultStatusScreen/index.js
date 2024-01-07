import React from "react";
import { TopBar } from "../../components/TopBar";
import { ExpandableItem } from "../../components/ExpandableItem";
import { getGeneralBalance } from "../../api/accounting";
import "./index.css";
import { generateReport } from "../../utils/reports/resultStatus";
import { SearchBar } from "../../components/SearchBar";
import { getOutletsApi } from "../../api/outlet";
import moment from "moment";
import esLocale from "moment/locale/es";

moment.locale("fr", [esLocale]);

function ResultStatusScreen() {
  const [outlets, setOutlets] = React.useState([]);
  const [data, setData] = React.useState({});
  const [searchParams, setSearchParams] = React.useState({
    outletId: "4a812a14-f46d-4a99-8d88-c1f14ea419f4",
    date: new Date().toISOString().split("T")[0],
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [reqToggle, setReqToggle] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const outlets = await getOutletsApi();
        setOutlets(outlets.body);
        let balance = await getGeneralBalance(searchParams);
        console.log(balance.body);
        let obj = {
          accounts: balance.body?.accounts.filter(
            (item) =>
              item.number[0] == "4" ||
              item.number[0] == "5" ||
              item.number[0] == "6"
          ),
          balances: balance.body?.accountBalances,
        };
        //console.log(balance.body?.accountBalances);
        // setBalancesData(balance.body?.accountBalances);
        setData(obj);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [reqToggle, searchParams]);

  // console.log(searchParams);

  const savepdf = () => {
    // let arr = data.balances.filter(
    //   (item) =>
    //     item.number[0] == "4" || item.number[0] == "5" || item.number[0] == "6"
    // );
    let reportDate = new Date(searchParams.date);

    let configParams = {
      title: "",
      subTitle: "ESTADO DE RESULTADO",
      date: reportDate.toLocaleString("es-Es", {
        timeZone: "UTC",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      fixedDate: reportDate,
    };

    generateReport(data, configParams);
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
      label: "A la Fecha De",
      field: "date",
      type: "date",
    },
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
      <TopBar title="Estado de Resultado" />
      <div className="screen-content">
        <SearchBar
          mainFilters={mainFilters}
          secondaryFilters={secondaryFilters}
          setSearchParams={setSearchParams}
          setRequestToggle={setReqToggle}
          exportFunction={() => savepdf()}
        />
        {getRenderItems(data)}
      </div>
    </div>
  );
}

function getRenderItems(arr) {
  let newArr = [];
  if (arr?.accounts != undefined) {
    for (let i = 0; i < arr.accounts?.length; i++) {
      newArr.push(
        <ExpandableItem
          key={i}
          title={arr.accounts[i]?.name}
          data={arr.accounts[i]}
          balances={arr?.balances}
        >
          {arr.accounts[i]?.controlledAccounts?.length > 0 ? (
            getRenderItems({
              accounts: arr.accounts[i]?.controlledAccounts,
              balances: arr.balances,
            })
          ) : (
            <div>hola</div>
          )}
        </ExpandableItem>
      );
    }
  }

  return newArr;
}

export { ResultStatusScreen };
