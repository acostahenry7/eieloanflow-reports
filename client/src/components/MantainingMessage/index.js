import React from "react";
import { TbAlertCircleFilled } from "react-icons/tb";
import RobotImage from "../../media/icons8-broken-robot-100.png";
import { moduleNames } from "../../utils/ui-helpers";

function MantainingMessage() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* NO TIENES ACCESSO A ESTE REPORTE! */}
      <div
        style={{
          backgroundColor: "transparent",
          minWidth: 400,
          width: "max-content",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          borderRadius: 20,
          fontFamily: "Poppins",
          color: "rgba(0,0,0,0.7)",
          // boxShadow: "0 1px 10px rgba(0,0,0,0.2)",
        }}
      >
        <TbAlertCircleFilled color="rgba(21, 111, 215, 0.6)" size={100} />

        <p style={{ margin: 0, fontSize: 30, marginTop: 15 }}>Advertencia</p>
        <p style={{ fontStyle: "italic", marginTop: 4 }}>
          Este módulo aún se encuentra en mantenimiento
        </p>
      </div>
    </div>
  );
}

export { MantainingMessage };
