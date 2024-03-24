import React from "react";
import "./index.css";
import CurrencyFormat from "react-currency-format";

function TotalBar({ data, loadingStatus }) {
  console.log(
    "#####",
    data.filter((item) => item.child.status_type == "ENABLED")
  );

  return (
    <div
      style={{
        display: loadingStatus ? "none" : "flex",
        alignItems: "center",
        marginTop: "-150px",
        // justifyContent: "space-between",
        width: "100%",
      }}
    >
      <div>Total</div>
      <div className="list-container">
        <ul
          style={{
            display: "flex",
            width: "70%",
            justifyContent: "flex-start",
          }}
        >
          <li className="list-item">
            <CurrencyFormat
              value={data.reduce((acc, item) => acc + item.child.length, 0)}
              displayType={"text"}
              thousandSeparator={true}
              prefix={""}
            />
          </li>

          <li className="list-item">
            <CurrencyFormat
              value={data
                .reduce(
                  (acc, item) => acc + parseFloat(item.register.amount),
                  0
                )
                .toFixed(2)}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"RD $"}
            />
          </li>
          <li className="list-item">
            <CurrencyFormat
              value={data
                .reduce(
                  (acc, item) =>
                    acc + parseFloat(item.register.total_cash || 0),
                  0
                )
                .toFixed(2)}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"RD $"}
            />
          </li>
          <li className="list-item">
            <CurrencyFormat
              value={data
                .reduce(
                  (acc, item) =>
                    acc + parseFloat(item.register.total_check || 0),
                  0
                )
                .toFixed(2)}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"RD $"}
            />
          </li>
          <li className="list-item">
            <CurrencyFormat
              value={data
                .reduce(
                  (acc, item) =>
                    acc + parseFloat(item.register.total_transfer || 0),
                  0
                )
                .toFixed(2)}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"RD $"}
            />
          </li>
          <li className="list-item">
            <CurrencyFormat
              value={data
                .reduce(
                  (acc, item) =>
                    acc + parseFloat(item.register.total_discount || 0),
                  0
                )
                .toFixed(2)}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"RD $"}
            />
          </li>
          <li className="list-item">
            <CurrencyFormat
              value={data
                .reduce(
                  (acc, item) => acc + parseFloat(item.register.total_pay || 0),
                  0
                )
                .toFixed(2)}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"RD $"}
            />
          </li>
        </ul>
      </div>
    </div>
  );
}

export { TotalBar };
