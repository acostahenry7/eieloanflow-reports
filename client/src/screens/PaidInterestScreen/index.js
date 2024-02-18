import React from "react";
import { TopBar } from "../../components/TopBar";
import { PaidInterestCrud } from "../../components/cruds/PaidInterestCrud";

function PaidInterestScreen() {
  return (
    <div className="">
      <TopBar title="Intereses cobrados" />
      <div className="screen-content">
        <PaidInterestCrud />
      </div>
    </div>
  );
}

export { PaidInterestScreen };
