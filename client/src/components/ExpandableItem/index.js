import React from "react";
import "./index.css";
import { BiChevronDown } from "react-icons/bi";
import CurrencyFormat from "react-currency-format";
import { currencyFormat } from "../../utils/reports/report-helpers";

function ExpandableItem(props) {
  const [opened, setOpened] = React.useState(false);
  const toggleItem = () => {
    setOpened(!opened);
  };

  // console.log("#########", props.balances);
  // console.log(
  //   props.data.name,
  //   props.balances?.filter(
  //     (sItem) => sItem.account_catalog_id == props.data.account_catalog_id
  //   )
  // );

  let currentAccountBalance = props.balances?.filter(
    (sItem) => sItem.account_catalog_id == props.data.account_catalog_id
  )[0].balance;

  // console.log(currentAccountBalance);

  return (
    <div className="expandable">
      {props.data?.controlledAccounts?.length > 0 ? (
        <>
          <div className="expandable-header" onClick={toggleItem}>
            <span>
              {props.data.number} - {props?.title}
            </span>
            <BiChevronDown
              size={20}
              className={`expandable-header-icon ${
                opened == true ? "open" : ""
              }`}
            />
          </div>

          <div className={`expandable-body ${opened == true ? "open" : ""}`}>
            {props.children}
          </div>
        </>
      ) : (
        <LasChild {...props} balance={currentAccountBalance} />
      )}
      {props.data?.controlledAccounts?.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p>
            <b>Total</b>
          </p>
          {/* <span>{props.data.balance}</span> */}
          <b>
            {currencyFormat(currentAccountBalance)}
            {/* <CurrencyFormat
              value={currentAccountBalance}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"RD$"}
            /> */}
          </b>
        </div>
      )}
    </div>
  );
}

function LasChild(props) {
  return (
    <div className="expandable-last-child">
      <p>
        {props.data.number} - {props.data.name}
      </p>
      <CurrencyFormat
        value={props.balance}
        displayType={"text"}
        thousandSeparator={true}
        prefix={"RD$"}
      />
    </div>
  );
}

export { ExpandableItem };
