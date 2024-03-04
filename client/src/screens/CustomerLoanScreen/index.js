import React from "react";
import { TopBar } from "../../components/TopBar";
import { CustomerLoanCrud } from "../../components/cruds/CustomerLoanCrud";

function CustomerLoanScreen() {
  return (
    <div className="">
      <TopBar title="Clientes" />
      <div className="screen-content">
        <CustomerLoanCrud />
      </div>
    </div>
  );
}

export { CustomerLoanScreen };
