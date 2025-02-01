import React from "react";
import { ImArrowUp, ImArrowDown } from "react-icons/im";
import { currencyFormat } from "../../utils/reports/report-helpers";
import { getLabelByTransactionType } from "../../utils/stringFunctions";
import { BiCheck } from "react-icons/bi";

const TransactionItem = (props) => {
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        padding: "20px 14px",
        gap: 20,
        backgroundColor: "white",
        borderRadius: 4,
        borderLeftStyle: "solid",
        borderWidth: 4,
        borderColor:
          props.transaction_type === "ENTRY"
            ? "rgba(102, 176, 80, 0.7)"
            : "rgba(227, 35, 29, 0.5)",
        boxShadow: "0 1px 5px rgba(0,0,0,0.2)",
        textOverflow: "ellipsis",
      }}
    >
      <span style={{ width: 100 }}>{props.target_date}</span>
      {props.transaction_type == "ENTRY" ? (
        <ImArrowUp size={16} color="green" />
      ) : (
        <ImArrowDown size={16} color="red" />
      )}
      <span style={{ width: 100 }}>
        {getLabelByTransactionType(props.transaction_type)}
      </span>
      <span style={{ width: 250 }}>{props.description}</span>
      <span
        style={{ width: 300, color: "#333333" }}
      >{`${getLabelByTransactionType(props.transaction_type)} Referencia ${
        props.reference
      }`}</span>
      <span style={{ width: 150 }}>{currencyFormat(props.amount)}</span>
      <span style={{ width: 150 }}>{currencyFormat(props.diary_amount)}</span>
      <div
        style={{
          border: "1px solid gray",
          borderRadius: 6,
          cursor: "pointer",
          textAlign: "center",
          position: "absolute",
          right: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {props.amount == props.diary_amount && <BiCheck size={25} />}
      </div>
    </div>
  );
};

export default TransactionItem;
