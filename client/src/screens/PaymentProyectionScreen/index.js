import React from "react";
import { TopBar } from "../../components/TopBar";
import { PaymentProyectionCrud } from "../../components/cruds/PaymentProyectionCrud";

function PaymentProyectionScreen() {
  return (
    <div className="">
      <TopBar title="Tendencia de cobros" />
      <div className="screen-content">
        <PaymentProyectionCrud />
      </div>
    </div>
  );
}

export { PaymentProyectionScreen };
