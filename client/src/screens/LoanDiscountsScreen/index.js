import React from "react";
import { TopBar } from "../../components/TopBar";
import { LoanDiscountsCrud } from "../../components/cruds/LoanDiscountsCrud";

function LoanDiscountsScreen() {
  return (
    <div className="">
      <TopBar title="Descuentos a préstamos" />
      <div className="screen-content">
        <LoanDiscountsCrud />
      </div>
    </div>
  );
}

export { LoanDiscountsScreen };
