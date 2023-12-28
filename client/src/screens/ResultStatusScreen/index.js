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
              item.number[0] == "4" ||
              item.number[0] == "5" ||
              item.number[0] == "6"
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
    // let arr = data.balances.filter(
    //   (item) =>
    //     item.number[0] == "4" || item.number[0] == "5" || item.number[0] == "6"
    // );

    let configParams = {
      title: "",
      subTitle: "ESTADO DE RESULTADO",
      date: "",
    };

    generateReport(data, configParams);
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
