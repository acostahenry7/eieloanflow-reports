import React from "react";
import { TopBar } from "../../components/TopBar";
import { LoanMovementCrud } from "../../components/cruds/LoanMovementCrud";

function LoanMovementScreen() {
  return (
    <div className="">
      <TopBar title="Movimiento en el préstamo" />
      <div className="screen-content">
        <LoanMovementCrud />
      </div>
    </div>
  );
}

export { LoanMovementScreen };
