import React from "react";
import { TopBar } from "../../components/TopBar";
import { RegisterCloseCrud } from "../../components/cruds/RegisterCloseCrud";

function RegisterCloseScreen() {
  return (
    <div className="">
      <TopBar title="Cierre de caja" />
      <div className="screen-content">
        <RegisterCloseCrud />
      </div>
    </div>
  );
}

export { RegisterCloseScreen };
