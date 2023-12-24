import React from "react";
import { TopBar } from "../../components/TopBar";
import { ExpandableItem } from "../../components/ExpandableItem";
import { getGeneralBalance } from "../../api/accounting";
import "./index.css";
import { generateReport } from "../../utils/reports/resultStatus";

function ResultStatusScreen() {
  const [data, setData] = React.useState({});
  const [balancesData, setBalancesData] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      try {
        let balance = await getGeneralBalance({});
        console.log(balance.body);
        let obj = {
          accounts: balance.body?.accounts.filter(
            (item) =>
              item.account_catalog_id ==
                "e93080ed-513f-4dea-9f78-a49b08207eea" ||
              item.account_catalog_id == "460fdec1-8e2f-4cd3-8944-f93f656ba1cb"
          ),
          balances: balance.body?.accountBalances,
        };
        // console.log(balance.body?.accountBalances);
        // setBalancesData(balance.body?.accountBalances);
        setData(obj);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const savepdf = () => {
    let arr = data.balances.filter(
      (item) => item.number[0] == "4" || item.number[0] == "6"
    );

    generateReport(arr);
  };

  return (
    <div className="">
      <TopBar title="Estado de Resultado" />

      <div className="screen-content">
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
  if (arr?.accounts != undefined) {
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
  }

  return newArr;
}

export { ResultStatusScreen };
