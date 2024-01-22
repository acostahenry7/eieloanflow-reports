import React from "react";
import { TopBar } from "../../components/TopBar";
import { LoanApplicationCrud } from "../../components/cruds/LoanApplicationCrud";

function LoanApplicationScreen() {
  return (
    <div className="">
      <TopBar title="Solicitudes de préstamo" />
      <div className="screen-content">
        <LoanApplicationCrud />
      </div>
    </div>
  );
}

export { LoanApplicationScreen };
