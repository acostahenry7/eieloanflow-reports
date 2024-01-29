import React from "react";
import { TopBar } from "../../components/TopBar";
import { AmortizationTableCrud } from "../../components/cruds/AmortizationTableCrud";

function AmortizationTableScreen() {
  return (
    <div className="">
      <TopBar title="Tabla de amortización" />
      <div className="screen-content">
        <AmortizationTableCrud />
      </div>
    </div>
  );
}

export { AmortizationTableScreen };
