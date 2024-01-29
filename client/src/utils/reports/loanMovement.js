import { jsPDF } from "jspdf";
import {
  createTitle,
  createSubTitle,
  createMainTitle,
  createMainSubTitle,
  createDate,
  currencyFormat,
  generateReportSection,
  spacing,
  sectionSpacing,
  getTextWidth,
} from "./report-helpers";
import { getLoanSituationLabel, getLoanTypeLabel } from "../stringFunctions";

let colsWidth = [70, 120, 150, 195, 232];
let innerColsWidth = [30, 130, 190, 235];

function generateReport(data, configParams) {
  //General Configuration Params
  //-------Layout--------
  let headerTop = 20;
  let top = 40;
  let left = 10;
  let right = left + 140;
  let granTotalRight = 460;
  let rightTotal = right;
  let center = 80;
  let itemsPerPage = 28;

  //-------File settings---------
  let fileNameDate = new Date().toISOString().split("T")[0];
  let fileName = `movimiento-en-prestamo-${fileNameDate}.pdf`;

  const width = 215.9;
  const height = 279.4;
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [width, height],
  });

  let parentAccounts = [];

  let title = `${configParams.title}`;
  let subTitle = `MOVIMIENTO EN EL PRESTAMO`;
  let date = `${configParams.date}`;

  createMainTitle(doc, title, left, headerTop - 5);
  createMainSubTitle(doc, subTitle, left, headerTop);
  createDate(doc, date, right + 87, headerTop);

  let counter = 0;
  renderTableHeader(doc, left, top - 10);
  data.map((item, acIndex) => {
    let customerName = `${item.loanMovement.customer_name
      ?.split(" ")
      .map((item, index) => (index <= 3 ? item : undefined))
      .filter((item) => item != undefined)
      .join(" ")}`;
    doc.text(`${customerName}`, left, top);
    createSubTitle(
      doc,
      `${item.loanMovement.loan_number_id}`,
      left + colsWidth[0] + 16,
      top,
      {
        align: "right",
      }
    );
    doc.text(
      `${getLoanTypeLabel(item.loanMovement.loan_type)}`,
      left + colsWidth[1] + 8,
      top,
      {
        align: "right",
      }
    );
    doc.text(
      `${getLoanSituationLabel(item.loanMovement.loan_situation)}`,
      left + colsWidth[2] + 16,
      top,
      { align: "right" }
    );
    doc.text(
      `${getLoanSituationLabel(item.loanMovement.status_type, false)}`,
      left + colsWidth[3] + 13,
      top,
      { align: "right" }
    );
    doc.text(
      `${currencyFormat(item.child.length, false)}`,
      left + colsWidth[4] + 23,
      top,
      { align: "right" }
    );

    top += sectionSpacing;
    //-----------------INNER TRANSACTION-----------------
    renderInnerTableHeader(doc, left, top);
    top += sectionSpacing;
    item.child.map((innerItem, innerIndex) => {
      counter += 1;

      doc.text(
        `${
          new Date(innerItem.created_date).toLocaleString("do-ES").split(",")[0]
        }`,
        left + 2,
        top
      );
      doc.text(`${innerItem.pay}`, left + innerColsWidth[0], top);
      doc.text(
        `${innerItem.quota_number}`,
        left + innerColsWidth[1] + 10,
        top,
        { align: "right" }
      );

      switch (innerItem.payment_type) {
        case "CASH":
          innerItem.payment_type = "Efectivo";
          break;
        case "CHECK":
          innerItem.payment_type = "Cheque";
          break;
        case "TRANSFER":
          innerItem.payment_type = "Transferencia";
          break;
        default:
          innerItem.payment_type = "Efectivo";
          break;
      }
      doc.text(
        `${innerItem.payment_type}`,
        left + innerColsWidth[2] + 10,
        top,
        { align: "right" }
      );
      doc.text(
        `${getLoanSituationLabel(
          innerItem.quota_status
            .split(",")
            [innerItem.quota_status.split(",").length - 1].trim()
        )}`,
        left + innerColsWidth[3] + 15,
        top,
        { align: "right" }
      );

      top += spacing;

      if (innerIndex == item.child.length - 1) {
        createSubTitle(doc, "Total: ", left + 2, top + 5);
        createSubTitle(
          doc,
          currencyFormat(
            item.child.reduce(
              (acc, element) => acc + parseFloat(element.pay),
              0
            )
          ),
          left + innerColsWidth[0],
          top + 5
        );
      }

      if (counter == itemsPerPage) {
        doc.addPage();
        top = 40;
        renderInnerTableHeader(doc, left, top - 10);
        counter = 0;
      }
    });

    if (acIndex != data.length - 1) {
      counter = 0;
      doc.addPage();
      top = 40;
      renderTableHeader(doc, left, top - 10);
    }
  });

  doc.save(fileName);
}

function renderTableHeader(doc, pos, top) {
  doc.rect(pos, top - 6, 260, 10);
  // pos += 3;
  createSubTitle(doc, "Cliente", pos + 1, top);
  createSubTitle(doc, "Préstamo", pos + colsWidth[0], top);
  createSubTitle(doc, "Tipo", pos + colsWidth[1], top);
  createSubTitle(doc, "Situación", pos + colsWidth[2], top);
  createSubTitle(doc, "Estatus", pos + colsWidth[3], top);
  createSubTitle(doc, "Número de\nTransacciones", pos + colsWidth[4], top - 2);

  // pos += colsWidth[2];
  // createSubTitle(doc, "Créditos", pos, top, "center");
  // pos += colsWidth[3];
  // createSubTitle(doc, "Balance", pos, top, "center");
}

function renderInnerTableHeader(doc, pos, top) {
  doc.rect(pos, top - 6, 260, 10);
  // pos += 3;
  createSubTitle(doc, "Fecha\nPago", pos + 1, top - 2);
  createSubTitle(doc, "Monto\nPago", pos + innerColsWidth[0], top - 2);
  createSubTitle(doc, "Cuotas\nPagadas", pos + innerColsWidth[1], top - 2);
  createSubTitle(doc, "Tipo\nPago", pos + innerColsWidth[2], top - 2);
  createSubTitle(doc, "Estatus\nUlt. cuota", pos + innerColsWidth[3], top - 2);
  // createSubTitle(doc, "Total\nTransferencia", pos + colsWidth[4], top - 2);
  // createSubTitle(doc, "Total\nDescuento", pos + colsWidth[5], top - 2);
  // createSubTitle(doc, "Total\nPagado", pos + colsWidth[6], top - 2);
  // createSubTitle(doc, "Fecha\nApertura", pos + colsWidth[7], top - 2);

  // pos += colsWidth[2];
  // createSubTitle(doc, "Créditos", pos, top, "center");
  // pos += colsWidth[3];
  // createSubTitle(doc, "Balance", pos, top, "center");
}

export { generateReport };
