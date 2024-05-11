import React from "react";
import { TopBar } from "../../components/TopBar";
import { GroupedRegisterClose } from "../../components/cruds/GroupedRegisterCloseCrud";

function GroupedRegisterCloseScreen() {
  return (
    <div className="">
      <TopBar title="Condensado de caja" />
      <div className="screen-content">
        <GroupedRegisterClose />
      </div>
    </div>
  );
}

export { GroupedRegisterCloseScreen };
