import React from "react";
import { TopBar } from "../../components/TopBar";
import { LoanDetailCrud } from "../../components/cruds/LoanDetailCrud";

function LoanDetailScreen() {
  return (
    <div className="">
      <TopBar title="Detalle de préstamo" />
      <div className="screen-content">
        <LoanDetailCrud />
      </div>
    </div>
  );
}

export { LoanDetailScreen };
