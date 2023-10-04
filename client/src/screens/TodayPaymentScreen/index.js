import React from "react";
import { TopBar } from "../../components/TopBar";
import { TodayPaymentCrud } from "../../components/cruds/TodayPaymentCrud";

function TodayPaymentScreen() {
  return (
    <div className="">
      <TopBar title="Pagos para hoy" />
      <div className="screen-content">
        <TodayPaymentCrud />
      </div>
    </div>
  );
}

export { TodayPaymentScreen };
