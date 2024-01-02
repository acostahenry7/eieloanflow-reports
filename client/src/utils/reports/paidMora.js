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

let colsWidth = [85, 115, 155, 190];

function generateReport(data, configParams) {
  //General Configuration Params
  //-------Layout--------
  let headerTop = 20;
  let top = 40;
  let bot = 215 - 15;
  let left = 20;
  let right = left + 140;
  let granTotalRight = 460;
  let rightTotal = right;
  let center = 80;
  let itemsPerPage = 30;

  //-------File settings---------
  let fileNameDate = new Date().toISOString().split("T")[0];
  let fileName = `mora-pagada-${fileNameDate}.pdf`;

  const width = 215.9;
  const height = 279.4;
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [width, height],
  });

  let parentAccounts = [];

  let title = `${configParams.title}`;
  let subTitle = `MORA PAGADA`;
  let date = `${configParams.date}`;

  createMainTitle(doc, title, left, headerTop - 5);
  createMainSubTitle(doc, subTitle, left, headerTop);
  createDate(doc, date, right + 67, headerTop);

  let counter = 0;
  renderTableHeader(doc, left, top - 10);
  data.map((item, index) => {
    //Adding one entry
    let customerName = `${item.customer_name
      ?.split(" ")
      .map((item, index) => (index <= 3 ? item : undefined))
      .filter((item) => item != undefined)
      .join(" ")}`;
    doc.text(`${customerName}`, left, top);
    createSubTitle(doc, `${item.loan_number_id}`, left + colsWidth[0], top);
    doc.text(
      `${new Date(item.payment_date).toLocaleString("es-Es").split(",")[0]}`,
      left + colsWidth[1],
      top
    );
    createSubTitle(doc, `${item.paid_mora}`, left + colsWidth[2] + 13, top, {
      align: "right",
    });
    doc.text(`${item.discount_mora}`, left + colsWidth[3] + 13, top, {
      align: "right",
    });

    // doc.text(`${item.arrear_percentaje}%`, left + 155, top);
    // doc.text(
    //   `${new Date(item.defeated_since).toLocaleString("es-Es").split(",")[0]}`,
    //   left + 180,
    //   top
    // );
    // doc.text(`${item.defeated_amount}`, left + 210, top);
    top += spacing;
    counter++;
    if (counter == itemsPerPage) {
      // renderTotalFooter(
      //   doc,
      //   left,
      //   top + spacing,
      //   data.filter((item, index) => itemsPerPage + index < itemsPerPage),
      //   "Total Página"
      // );
      doc.addPage();
      top = 40;
      renderTableHeader(doc, left, top - 10);
      counter = 0;
    }
    if (index == data.length - 1) {
      // let marginTop = data.length > itemsPerPage ? spacing + 20 : spacing;
      renderTotalFooter(doc, left, top + spacing, data, "Total General");
    }
  });

  doc.save(fileName);
}

function renderTableHeader(doc, pos, top) {
  doc.rect(pos, top - 6, 240, 10);
  // pos += 3;
  createSubTitle(doc, "Cliente", pos + 1, top);
  createSubTitle(doc, "Préstamo", pos + colsWidth[0], top);
  createSubTitle(
    doc,
    "Fecha\nMora Acum.",
    pos + colsWidth[1],
    top - 2,
    "center"
  );
  createSubTitle(doc, "Mora\nPagada", pos + colsWidth[2], top - 2);
  createSubTitle(doc, "Descuento\nMora", pos + colsWidth[3], top - 2);
  //   createSubTitle(doc, "Fecha", pos + colsWidth[4], top);

  // pos += colsWidth[2];
  // createSubTitle(doc, "Créditos", pos, top, "center");
  // pos += colsWidth[3];
  // createSubTitle(doc, "Balance", pos, top, "center");
}

function renderTotalFooter(doc, pos, top, data, label) {
  doc.rect(pos, top - 6, 240, 10);
  // pos += 3;
  createSubTitle(doc, label, pos + 1, top);
  createSubTitle(
    doc,
    currencyFormat(
      data.reduce((acc, item) => acc + parseFloat(item.paid_mora), 0)
    ),
    pos + colsWidth[2] - 14,
    top
  );
  createSubTitle(
    doc,
    currencyFormat(
      data.reduce((acc, item) => acc + parseFloat(item.discount_mora), 0)
    ),
    pos + colsWidth[3] + 14,
    top,
    {
      align: "right",
    }
  );
  //   createSubTitle(doc, "Fecha", pos + colsWidth[4], top);

  // pos += colsWidth[2];
  // createSubTitle(doc, "Créditos", pos, top, "center");
  // pos += colsWidth[3];
  // createSubTitle(doc, "Balance", pos, top, "center");
}

export { generateReport };
