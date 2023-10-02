import React from "react";
import { TopBar } from "../../components/TopBar";
import { CustomerCrud } from "../../components/cruds/CustomerCrud";

function CustomerReportScreen() {
  return (
    <div className="">
      <TopBar title="Clientes en atraso" />
      <div className="screen-content">
        <CustomerCrud />
      </div>
    </div>
  );
}

export { CustomerReportScreen };
