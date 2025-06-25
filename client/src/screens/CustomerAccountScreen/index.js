import React from "react";
import { TopBar } from "../../components/TopBar";
import { CustomerAccountCrud } from "../../components/cruds/CustomerAccountStatus";

function CustomerAccountScreen() {
  return (
    <div className="">
      <TopBar title="Estado de cuenta" />
      <div className="screen-content">
        <CustomerAccountCrud />
      </div>
    </div>
  );
}

export { CustomerAccountScreen };
