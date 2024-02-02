import React from "react";
import { TopBar } from "../../components/TopBar";
import { ToChargeAccountCrud } from "../../components/cruds/ToChargeAccountCrud";

function ToChargeAccountScreen() {
  return (
    <div className="">
      <TopBar title="Cuentas por cobrar" />
      <div className="screen-content">
        <ToChargeAccountCrud />
      </div>
    </div>
  );
}

export { ToChargeAccountScreen };
