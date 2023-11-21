import React from "react";
import { TopBar } from "../../components/TopBar";
import { ValidationBalanceCrud } from "../../components/cruds/ValidationBalanceCrud";

function ValidationBalanceScreen() {
  return (
    <div className="">
      <TopBar title="Balanza de comprobación" />
      <div className="screen-content">
        <ValidationBalanceCrud />
      </div>
    </div>
  );
}

export { ValidationBalanceScreen };
