import React from "react";
import { TopBar } from "../../components/TopBar";
import { ExpandableItem } from "../../components/ExpandableItem";
import { getGeneralBalance } from "../../api/accounting";
import { generateReport } from "../../utils/reports/generalBalance";
import { SearchBar } from "../../components/SearchBar";
import { getOutletsApi } from "../../api/outlet";
import { AuthContext } from "../../contexts/AuthContext";
import moment from "moment";
import esLocale from "moment/locale/es";

import "./index.css";
moment.locale("fr", [esLocale]);

function GeneralBalanceScreen() {
  const [outlets, setOutlets] = React.useState([]);
  const [data, setData] = React.useState({});
  const [searchParams, setSearchParams] = React.useState({
    outletId: "4a812a14-f46d-4a99-8d88-c1f14ea419f4",
    date: new Date().toISOString().split("T")[0],
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [reqToggle, setReqToggle] = React.useState([]);

  const { auth } = React.useContext(AuthContext);

  React.useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const outlets = await getOutletsApi();
        setOutlets(outlets.body);
        // .filter(
        //     (item) => item.outlet_id == "4a812a14-f46d-4a99-8d88-c1f14ea419f4"
        //   )
        const balance = await getGeneralBalance({
          ...searchParams,
          // outletId: "4a812a14-f46d-4a99-8d88-c1f14ea419f4",
        });
        console.log(balance.body);

        let obj = {
          accounts: balance.body?.accounts?.filter(
            (item) =>
              item.number[0] == "1" ||
              item.number[0] == "2" ||
              item.number[0] == "3"
          ),
          balances: balance.body?.accountBalances,
        };

        console.log(obj);
        setIsLoading(false);

        setData(obj);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    })();
  }, [reqToggle, searchParams]);

  const savepdf = () => {
    console.log(new Date(searchParams.date).toDateString());

    let reportDate = new Date(searchParams.date);

    let outletName = outlets.filter(
      (item) => item.outlet_id == searchParams.outletId
    )[0]?.name;
    let conf = {
      title: outletName,
      date: reportDate.toLocaleString("es-Es", {
        timeZone: "UTC",
        month: "long",
        day: "numeric",
      }),
    };
    generateReport(data, conf);
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
      <TopBar title="Balance General" />
      <div className="screen-content">
        <SearchBar
          mainFilters={mainFilters}
          secondaryFilters={secondaryFilters}
          setSearchParams={setSearchParams}
          setRequestToggle={setReqToggle}
        />
        <button className="btn" onClick={() => savepdf()}>
          Exportar
        </button>
        {getRenderItems(data)}
      </div>
    </div>
  );
}

function getRenderItems(arr) {
  let newArr = [];
  for (let i = 0; i < arr.accounts?.length; i++) {
    // let currentAccountBalance = parseFloat(arr[i].balance);
    // console.log(arr[i].controlledAccounts);

    // parseFloat(arr[i].balance);
    // if (arr[i].controlledAccounts?.length > 0) {
    //   arr[i].balance = arr[i].controlledAccounts?.reduce(
    //     (acc, account) => acc + parseFloat(account.balance),
    //     0
    //   );
    // }

    newArr.push(
      <ExpandableItem
        key={i}
        title={arr.accounts[i]?.name}
        data={arr.accounts[i]}
        balances={arr?.balances}
        // currentAccountBalance={currentAccountBalance}
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

  return newArr;
}

export { GeneralBalanceScreen };
