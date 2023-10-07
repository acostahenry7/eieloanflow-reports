import React from "react";
import { TopBar } from "../../components/TopBar";
import { ReceivedPaymentCrud } from "../../components/cruds/ReceivedPaymentCrud";

function ReceivedPaymentScreen() {
  return (
    <div className="">
      <TopBar title="Pagos recibidos" />
      <div className="screen-content">
        <ReceivedPaymentCrud />
      </div>
    </div>
  );
}

export { ReceivedPaymentScreen };
