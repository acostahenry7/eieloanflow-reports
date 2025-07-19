import React from "react";
import { TopBar } from "../../components/TopBar";
import { EmployeeLoanCrud } from "../../components/cruds/EmployeeLoanCrud";

function EmployeeLoanScreen() {
  return (
    <div className="">
      <TopBar title="Préstamos a empleados" />
      <div className="screen-content">
        <EmployeeLoanCrud />
      </div>
    </div>
  );
}

export { EmployeeLoanScreen };
