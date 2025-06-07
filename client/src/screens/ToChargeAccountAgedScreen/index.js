import React from "react";
import { TopBar } from "../../components/TopBar";
import { ToChargeAccountAgedCrud } from "../../components/cruds/ToChargeAccountAgedCrud";

function ToChargeAccountAgedScreen() {
  return (
    <div className="">
      <TopBar title="Cuentas por cobrar por Antiguedad de saldo" />
      <div className="screen-content">
        <ToChargeAccountAgedCrud />
      </div>
    </div>
  );
}

export { ToChargeAccountAgedScreen };
