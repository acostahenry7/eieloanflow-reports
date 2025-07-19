import React from "react";
import { TopBar } from "../../components/TopBar";
import { CollectorCommissionCrud } from "../../components/cruds/CollectorCommissionCrud";

function CollectorCommissionScreen() {
  return (
    <div className="">
      <TopBar title="Comisiones por cobros" />
      <div className="screen-content">
        <CollectorCommissionCrud />
      </div>
    </div>
  );
}

export { CollectorCommissionScreen };
