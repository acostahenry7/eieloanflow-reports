import React from "react";
import { TopBar } from "../../components/TopBar";
import { PaidMoraCrud } from "../../components/cruds/PaidMoraCrud";

function PaidMoraScreen() {
  return (
    <div className="">
      <TopBar title="Mora Pagada" />
      <div className="screen-content">
        <PaidMoraCrud />
      </div>
    </div>
  );
}

export { PaidMoraScreen };
