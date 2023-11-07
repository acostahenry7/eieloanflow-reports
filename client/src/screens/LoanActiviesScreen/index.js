import React from "react";
import { TopBar } from "../../components/TopBar";
import { LoanActivitiesCrud } from "../../components/cruds/LoanActiviesCrud";

function LoanActivitiesScreen() {
  return (
    <div className="">
      <TopBar title="Acciones al préstamo" />
      <div className="screen-content">
        <LoanActivitiesCrud />
      </div>
    </div>
  );
}

export { LoanActivitiesScreen };
