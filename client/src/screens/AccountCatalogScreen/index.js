import React from "react";
import { TopBar } from "../../components/TopBar";
import { AccountCatalogCrud } from "../../components/cruds/accountCatalogCrud";

function AccountCatalogSCreen() {
  return (
    <div className="">
      <TopBar title="Catálogo de cuentas" />
      <div className="screen-content">
        <AccountCatalogCrud />
      </div>
    </div>
  );
}

export { AccountCatalogSCreen };
