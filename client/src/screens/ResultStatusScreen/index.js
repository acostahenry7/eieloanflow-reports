import React from "react";
import { TopBar } from "../../components/TopBar";
import { ExpandableItem } from "../../components/ExpandableItem";
import { getGeneralBalance } from "../../api/accounting";
import "./index.css";

function ResultStatusScreen() {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      try {
        let balance = await getGeneralBalance({});
        console.log(balance.body);
        let arr = balance.body?.filter(
          (item) =>
            item.account_catalog_id == "e93080ed-513f-4dea-9f78-a49b08207eea" ||
            item.account_catalog_id == "460fdec1-8e2f-4cd3-8944-f93f656ba1cb"
        );
        setData(arr);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  console.log();

  return (
    <div className="">
      <TopBar title="Estado de Resultado" />
      <div className="screen-content">{getRenderItems(data)}</div>
    </div>
  );
}

function getRenderItems(arr) {
  let newArr = [];
  for (let i = 0; i < arr.length; i++) {
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
        title={arr[i]?.name}
        data={arr[i]}
        // currentAccountBalance={currentAccountBalance}
      >
        {arr[i]?.controlledAccounts?.length > 0 ? (
          getRenderItems(arr[i]?.controlledAccounts)
        ) : (
          <div>hola</div>
        )}
      </ExpandableItem>
    );
  }

  return newArr;
}

export { ResultStatusScreen };
