import React from "react";
import { TopBar } from "../../components/TopBar";
import { CanceledPaymentCrud } from "../../components/cruds/CanceledPaymentCrud";

function CanceledPaymentScreen() {
  return (
    <div className="">
      <TopBar title="Pagos cancelados" />
      <div className="screen-content">
        <CanceledPaymentCrud />
      </div>
    </div>
  );
}

export { CanceledPaymentScreen };
