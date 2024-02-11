import React from "react";
import { TopBar } from "../../components/TopBar";
import { EmployeeCrud } from "../../components/cruds/EmployeeCrud";

function EmployeeScreen() {
  return (
    <div className="">
      <TopBar title="Reporte empleados" />
      <div className="screen-content">
        <EmployeeCrud />
      </div>
    </div>
  );
}

export { EmployeeScreen };
