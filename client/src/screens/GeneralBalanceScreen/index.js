import React from "react";
import { TopBar } from "../../components/TopBar";
import { ExpandableItem } from "../../components/ExpandableItem";
import { getGeneralBalance } from "../../api/accounting";
import { generateReport } from "../../utils/reports/generalBalance";
import { SearchBar } from "../../components/SearchBar";
import "./index.css";
import { getOutletsApi } from "../../api/outlet";

function GeneralBalanceScreen() {
  const [outlets, setOutlets] = React.useState([]);
  const [data, setData] = React.useState({});
  const [searchParams, setSearchParams] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [reqToggle, setReqToggle] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      try {
        const outlets = await getOutletsApi();
        setOutlets(
          outlets.body.filter(
            (item) => item.outlet_id == "4a812a14-f46d-4a99-8d88-c1f14ea419f4"
          )
        );
        const balance = await getGeneralBalance({
          ...searchParams,
          outletId: "4a812a14-f46d-4a99-8d88-c1f14ea419f4",
        });
        console.log(balance.body);

        let obj = {
          accounts: balance.body?.accounts?.filter(
            (item) =>
              item.account_catalog_id ==
                "2f8cee32-92d8-40bb-9dcd-522bbe068285" ||
              item.account_catalog_id ==
                "97ce0bad-65e6-4451-a352-d81bc7879a4d" ||
              item.account_catalog_id == "cb06e761-3471-422c-b5c0-18e05860e487"
          ),
          balances: balance.body?.accountBalances,
        };

        console.log(obj);

        setData(obj);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [reqToggle, searchParams]);

  const savepdf = () => {
    let arr = data.balances.filter(
      (item) =>
        item.number[0] == "1" || item.number[0] == "2" || item.number[0] == "3"
    );

    generateReport(arr);
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
