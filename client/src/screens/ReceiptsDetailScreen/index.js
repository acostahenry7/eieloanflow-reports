import React from "react";
import { TopBar } from "../../components/TopBar";
import { ReceiptDetailCrud } from "../../components/cruds/ReceiptsDetailCrud";

function ReceiptsDetailScreen() {
  return (
    <div className="">
      <TopBar title="Recibos de Ingreso" />
      <div className="screen-content">
        <ReceiptDetailCrud />
      </div>
    </div>
  );
}

export { ReceiptsDetailScreen };
