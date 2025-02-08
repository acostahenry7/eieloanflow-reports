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
} from "./report-helpers";
import logo from "./images/logo";

let colsWidth = [60, 120];

function generateReport(data, configParams) {
  let parsedData = Object.entries(data).sort();

  //General Configuration Params
  //-------Layout--------
  let headerTop = 10;
  let top = 40;
  let left = 10;
  let right = left + 140;
  let granTotalRight = 460;
  let rightTotal = right;
  let center = 80;
  let itemsPerPage = 45;

  //-------File settings---------
  let fileNameDate = new Date().toISOString().split("T")[0];
  let fileName = `catalogo-de-cuentas-${fileNameDate}.pdf`;

  const width = 215.9;
  const height = 279.4;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [width, height],
  });

  let parentAccounts = [];

  let title = `${configParams.title}`;
  let subTitle = `CATALOGO DE CUENTAS`;
  let date = `${configParams.date || ""}`;

  createMainTitle(doc, title, right, headerTop);
  createMainSubTitle(doc, subTitle, right, headerTop + 5);
  createMainSubTitle(doc, date, right, headerTop + 10);

  doc.addImage(logo, "png", left + 2, headerTop - 5, 100, 25);

  //---------------------- TRANSACTIONS--------------------
  let counter = 0;
  renderTableHeader(doc, left, top);
  left += 1;
  top += 10;
  data.map((item, index) => {
    createSubTitle(doc, `${item.number}`, left + 2, top);
    doc.text(`${item.name}`, left + colsWidth[0] + 2, top);

    top += spacing;
    counter++;
    if (counter == itemsPerPage && index < data.length - 1) {
      doc.addPage();
      top = 40;
      renderTableHeader(doc, left, top - 10);
      counter = 0;
    }

    // if (index == data.length - 1) {
    //   doc.addPage();

    //   top = 40;
    //   createSubTitle(
    //     doc,
    //     "Balance Anterior (RD$)",
    //     left + colsWidth[2] - 19,
    //     headerTop + 12
    //   );
    //   createSubTitle(
    //     doc,
    //     "Balance Actual (RD$)",
    //     left + colsWidth[4] - 18,
    //     headerTop + 12
    //   );
    //   createSubTitle(
    //     doc,
    //     "Acumulado (RD$)",
    //     left + colsWidth[5] + 12,
    //     headerTop + 12
    //   );
    //   renderTableHeader(doc, left, top - 10);
    //   createSubTitle(doc, `Totales`, left, top);
    //   createSubTitle(
    //     doc,
    //     `${currencyFormat(
    //       data.reduce((acc, item) => acc + parseFloat(item.prev_debit), 0),
    //       false
    //     )}`,
    //     left + colsWidth[1] + 15,
    //     top,
    //     {
    //       align: "right",
    //     }
    //   );
    //   createSubTitle(
    //     doc,
    //     `${currencyFormat(
    //       data.reduce((acc, item) => acc + parseFloat(item.prev_credit), 0),
    //       false
    //     )}`,
    //     left + colsWidth[2] + 15,
    //     top,
    //     {
    //       align: "right",
    //     }
    //   );
    //   createSubTitle(
    //     doc,
    //     `${currencyFormat(
    //       data.reduce((acc, item) => acc + parseFloat(item.month_debit), 0),
    //       false
    //     )}`,
    //     left + colsWidth[3] + 15,
    //     top,
    //     {
    //       align: "right",
    //     }
    //   );
    //   createSubTitle(
    //     doc,
    //     `${currencyFormat(
    //       data.reduce((acc, item) => acc + parseFloat(item.month_credit), 0),
    //       false
    //     )}`,
    //     left + colsWidth[4] + 15,
    //     top,
    //     {
    //       align: "right",
    //     }
    //   );
    //   createSubTitle(
    //     doc,
    //     `${currencyFormat(
    //       data.reduce((acc, item) => acc + parseFloat(item.debit), 0),
    //       false
    //     )}`,
    //     left + colsWidth[5] + 15,
    //     top,
    //     {
    //       align: "right",
    //     }
    //   );
    //   createSubTitle(
    //     doc,
    //     `${currencyFormat(
    //       data.reduce((acc, item) => acc + parseFloat(item.credit), 0),
    //       false
    //     )}`,
    //     left + colsWidth[6] + 15,
    //     top,
    //     {
    //       align: "right",
    //     }
    //   );
    // }
  });

  console.log(counter);

  doc.save(fileName);
}

function renderTableHeader(doc, pos, top) {
  doc.rect(pos, top - 6, 195, 10);
  pos += 3;
  createSubTitle(doc, "No.\nCuenta", pos, top - 2, "center");
  createSubTitle(doc, "Descripción", pos + colsWidth[0], top, "center");
}

export { generateReport };
