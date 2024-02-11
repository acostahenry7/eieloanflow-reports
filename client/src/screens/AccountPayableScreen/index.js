import React from "react";
import { TopBar } from "../../components/TopBar";
import { AccountPayableCrud } from "../../components/cruds/AccountPayableCrud";

function AccountPayableScren() {
  return (
    <div className="">
      <TopBar title="Cuentas por pagar" />
      <div className="screen-content">
        <AccountPayableCrud />
      </div>
    </div>
  );
}

export { AccountPayableScren };
