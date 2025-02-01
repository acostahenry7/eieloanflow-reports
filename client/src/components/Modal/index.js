import React from "react";

const Modal = ({ children }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          minHeight: "80vh",
          width: "80vw",
          borderRadius: 12,
          boxSizing: "border-box",
          padding: 20,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
