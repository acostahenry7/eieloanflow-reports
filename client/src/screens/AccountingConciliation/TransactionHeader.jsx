import React from "react";

const TransactionHeader = () => {
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        padding: "14px 14px",
        gap: 20,
        backgroundColor: "white",
        borderRadius: 4,
        borderLeftStyle: "solid",
        borderWidth: 4,
        fontWeight: "bold",
        // borderColor:
        //   props.transaction_type === "ENTRY"
        //     ? "rgba(102, 176, 80, 0.7)"
        //     : "rgba(227, 35, 29, 0.5)",
        boxShadow: "0 1px 5px rgba(0,0,0,0.2)",
      }}
    >
      <span style={{ width: 100, minWidth: 100 }}>Fecha</span>
      <span style={{ width: 136 }}>Tipo</span>
      <span style={{ width: 250 }}>Descripción</span>
      <span style={{ width: 300, color: "#333333" }}>Descripción Diario</span>
      <span style={{ width: 150 }}>Monto</span>
      <span style={{ width: 150 }}>Monto en diario</span>
      <div
        style={{
          //   border: "1px solid gray",
          //   borderRadius: 6,
          cursor: "pointer",
          textAlign: "center",
          position: "absolute",
          right: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Conciliar
      </div>
    </div>
  );
};

export default TransactionHeader;
