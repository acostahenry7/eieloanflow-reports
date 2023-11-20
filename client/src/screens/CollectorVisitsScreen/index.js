import React from "react";
import { TopBar } from "../../components/TopBar";
import { CollectorVisitsCrud } from "../../components/cruds/CollectorVisitsCrud";

function CollectorVisitsScreen() {
  return (
    <div className="">
      <TopBar title="Visitas a clientes" />
      <div className="screen-content">
        <CollectorVisitsCrud />
      </div>
    </div>
  );
}

export { CollectorVisitsScreen };
