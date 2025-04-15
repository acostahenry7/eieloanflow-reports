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
import { getLoanTypeLabel, getLoanSituationLabel } from "../stringFunctions";
import logo from "./images/logo";

let colsWidth = [80, 98, 125, 152, 170, 195, 215, 240];

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
  let itemsPerPage = 30;

  //-------File settings---------
  let fileNameDate = new Date().toISOString().split("T")[0];
  let fileName = `detalle-de-prestamo-${fileNameDate}.pdf`;

  const width = 215.9;
  const height = 279.4;
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [width, height],
  });

  let parentAccounts = [];

  let title = `${configParams.title}`;
  let subTitle = `DETALLE DE PRESTAMO`;
  let date = `${configParams.date}`;

  createMainTitle(doc, title, right + 50, headerTop - 5);
  createMainSubTitle(doc, subTitle, right + 50, headerTop);
  createDate(doc, date, right + 87, headerTop + 10);

  doc.addImage(logo, "png", left, headerTop - 15, 100, 25);

  top += 10;

  let counter = 0;
  renderTableHeader(doc, left, top - 10);
  data.map((item, index) => {
    //Adding one entry
    let customerName = `${item.customer_name
      .split(" ")
      .map((item, index) => (index <= 3 ? item : undefined))
      .filter((item) => item != undefined)
      .join(" ")}`;
    doc.text(`${customerName}`, left, top);
    createSubTitle(doc, `${item.loan_number_id}`, left + colsWidth[0], top);
    doc.text(`${getLoanTypeLabel(item.loan_type)}`, left + colsWidth[1], top);
    doc.text(
      `${currencyFormat(item.amount_approved, false)}`,
      left + colsWidth[2] + 15,
      top,
      {
        align: "right",
      }
    );
    doc.text(
      `${currencyFormat(item.total_amount, false)}`,
      left + colsWidth[3] + 12,
      top,
      { align: "right" }
    );
    doc.text(`${item.number_of_installments}`, left + colsWidth[4] + 12, top, {
      align: "right",
    });
    doc.text(
      `${currencyFormat(item.amount_of_free, false)}`,
      left + colsWidth[5] + 12,
      top,
      { align: "right" }
    );
    doc.text(
      `${getLoanSituationLabel(item.status_type) || item.status_type}`,
      left + colsWidth[6],
      top
    );
    doc.text(
      `${getLoanSituationLabel(item.loan_situation)}`,
      left + colsWidth[7] + 17,
      top,
      { align: "right" }
    );

    top += spacing;
    counter++;

    if (index == data.length - 1) {
      createSubTitle(doc, "Total (RD$): ", left + 2, top + 5);
      createSubTitle(
        doc,
        currencyFormat(
          data.reduce(
            (acc, element) => acc + parseFloat(element.amount_approved),
            0
          ),
          false
        ),
        left + colsWidth[2] + 15,
        top + 5,
        { align: "right" }
      );
      createSubTitle(
        doc,
        currencyFormat(
          data.reduce(
            (acc, element) => acc + parseFloat(element.total_amount),
            0
          ),
          false
        ),
        left + colsWidth[3] + 13,
        top + 5,
        { align: "right" }
      );
      createSubTitle(
        doc,
        currencyFormat(
          data.reduce(
            (acc, element) => acc + parseFloat(element.amount_of_free),
            0
          ),
          false
        ),
        left + colsWidth[5] + 13,
        top + 5,
        { align: "right" }
      );
    }
    if (counter == itemsPerPage) {
      doc.addPage();
      top = 40;
      renderTableHeader(doc, left, top - 10);
      counter = 0;
    }
  });

  doc.save(fileName);
}

function renderTableHeader(doc, pos, top) {
  doc.rect(pos, top - 6, 260, 10);
  // pos += 3;
  createSubTitle(doc, "Cliente", pos + 1, top);
  createSubTitle(doc, "Préstamo", pos + colsWidth[0], top);
  createSubTitle(doc, "Tipo\nPréstamo", pos + colsWidth[1], top - 2);
  createSubTitle(doc, "Monto\nAprobado", pos + colsWidth[2], top - 2);
  createSubTitle(doc, "Total\nPte.", pos + colsWidth[3], top - 2);
  createSubTitle(doc, "No. de\nCuotas", pos + colsWidth[4], top - 2);
  createSubTitle(doc, "Monto\nCuota", pos + colsWidth[5], top - 2);
  createSubTitle(doc, "Estatus", pos + colsWidth[6], top);
  createSubTitle(doc, "Situación", pos + colsWidth[7], top);

  // pos += colsWidth[2];
  // createSubTitle(doc, "Créditos", pos, top, "center");
  // pos += colsWidth[3];
  // createSubTitle(doc, "Balance", pos, top, "center");
}

export { generateReport };
