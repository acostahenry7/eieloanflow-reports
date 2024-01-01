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

let colsWidth = [85, 105, 135, 160, 183, 203, 221, 265];

function generateReport(data, configParams) {
  //General Configuration Params
  //-------Layout--------
  let headerTop = 10;
  let top = 40;
  let left = 10;
  let right = left + 140;
  let granTotalRight = 460;
  let rightTotal = right;
  let center = 80;
  let itemsPerPage = 30;

  //-------File settings---------
  let fileNameDate = new Date().toISOString().split("T")[0];
  let fileName = `pagos-recibidos-${fileNameDate}.pdf`;

  const width = 215.9;
  const height = 279.4;
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [width, height],
  });

  let parentAccounts = [];

  let title = `${configParams.title}`;
  let subTitle = `PAGOS RECIBIDOS`;
  let date = `${configParams.date}`;

  createMainTitle(doc, title, center, headerTop);
  createMainSubTitle(doc, subTitle, center + 8, headerTop + spacing + 0.8);
  createDate(doc, date, center + 14, headerTop + spacing * 2);

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
    doc.text(`${item.receipt_number}`, left + colsWidth[1], top);
    doc.text(`${item.created_by}`, left + colsWidth[2], top);
    doc.text(`${item.payment_type}`, left + colsWidth[3], top);
    doc.text(
      `${new Date(item.created_date).toLocaleString("es-Es").split(",")[0]}`,
      left + colsWidth[4] + 10,
      top,
      {
        align: "right",
      }
    );
    doc.text(
      `${
        item.paid_dues
          ?.split(",")
          .map((i) => parseInt(i))
          .sort(function (a, b) {
            return a - b;
          })[0] || 0
      }-->${
        item.paid_dues
          ?.split(",")
          .map((i) => parseInt(i))
          .sort(function (a, b) {
            return a - b;
          })[item.paid_dues?.split(",").length - 1] || 0
      }`,
      left + colsWidth[5] + 10,
      top,
      {
        align: "right",
      }
    );
    // doc.text(`${item.discount}`, left + colsWidth[7], top, {
    //   align: "right",
    // });
    doc.text(`${item.total_paid_mora}`, left + colsWidth[6] + 10, top, {
      align: "right",
    });
    createSubTitle(doc, `${item.pay}`, left + colsWidth[7] - 7, top, {
      align: "right",
    });

    top += spacing;
    counter++;
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
  createSubTitle(doc, "Teléfono", pos + colsWidth[1], top, "center");
  createSubTitle(doc, "Monto\nAprobado", pos + colsWidth[2], top - 2);
  createSubTitle(doc, "Monto\nCuota", pos + colsWidth[3], top - 2);
  createSubTitle(doc, "Fecha\nPago", pos + colsWidth[4], top - 2);
  createSubTitle(doc, "Cuotas\nPagadas", pos + colsWidth[5], top - 2);
  createSubTitle(doc, "Mora\nPagada", pos + colsWidth[6], top - 2);
  createSubTitle(doc, "Monto\n(RD$)", pos + colsWidth[7] - 19, top - 2);
  // pos += colsWidth[2];
  // createSubTitle(doc, "Créditos", pos, top, "center");
  // pos += colsWidth[3];
  // createSubTitle(doc, "Balance", pos, top, "center");
}

function formatComment(comment, aproxLimit) {
  let str = "";
  let counter = 0;
  let lastIterationValue = 0;
  for (let i = 0; i < comment?.length; i++) {
    counter++;
    if (comment[i] != ",") {
      str += comment[i];
    }
    if (
      (counter >= aproxLimit && comment[i + 1] == ",") ||
      i == comment.length - 1
    ) {
      counter = 0;
      str += "\n";
    }

    lastIterationValue = i;
  }

  str.split(" ").sort().join(",");

  return [str, lastIterationValue];
}

export { generateReport };
