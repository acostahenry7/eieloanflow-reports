import React from "react";
import { TopBar } from "../../components/TopBar";
import { PaymentControlHistoryCrud } from "../../components/cruds/PaymentControlHistoryCrud";

function PaymentControlHistoryScreen() {
  return (
    <div className="">
      <TopBar title="Historico control de cobros" />
      <div className="screen-content">
        <PaymentControlHistoryCrud />
      </div>
    </div>
  );
}

export { PaymentControlHistoryScreen };
