import React from "react";
import { TopBar } from "../../components/TopBar";
import { DatacreditCrud } from "../../components/cruds/DatacreditCrud";

function DatacreditScreen() {
  return (
    <div className="">
      <TopBar title="Datacrédito" />
      <div className="screen-content">
        <DatacreditCrud />
      </div>
    </div>
  );
}

export { DatacreditScreen };
