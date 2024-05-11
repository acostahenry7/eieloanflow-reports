import React from "react";
import { TopBar } from "../../components/TopBar";
import { BoxMajorCrud } from "../../components/cruds/BoxMajorCrud";

function BoxMajorScreen() {
  return (
    <div className="">
      <TopBar title="Mayor Caja (cajeros)" />
      <div className="screen-content">
        <BoxMajorCrud />
      </div>
    </div>
  );
}

export { BoxMajorScreen };
