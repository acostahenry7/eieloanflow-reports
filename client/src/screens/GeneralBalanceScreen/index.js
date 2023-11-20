import React from "react";
import { TopBar } from "../../components/TopBar";
import { ExpandableItem } from "../../components/ExpandableItem";
import { getGeneralBalance } from "../../api/accounting";
import "./index.css";

function GeneralBalanceScreen() {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      try {
        let balance = await getGeneralBalance({});
        console.log(balance.body);
        let arr = balance.body?.filter(
          (item) =>
            item.account_catalog_id == "2f8cee32-92d8-40bb-9dcd-522bbe068285" ||
            item.account_catalog_id == "97ce0bad-65e6-4451-a352-d81bc7879a4d" ||
            item.account_catalog_id == "cb06e761-3471-422c-b5c0-18e05860e487"
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
      <TopBar title="Balance General" />
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

export { GeneralBalanceScreen };
