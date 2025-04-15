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
import logo from "./images/logo";

let colsWidth = [80, 105, 135, 160, 179, 206];

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
  let fileName = `pagos-pendientes-${fileNameDate}.pdf`;

  const width = 215.9;
  const height = 279.4;
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [width, height],
  });

  let parentAccounts = [];

  let title = `${configParams.title}`;
  let subTitle = `PAGOS PENDIENTES`;
  let date = `${configParams.date}`;

  createMainTitle(doc, title, right + 10, headerTop - 5);
  createMainSubTitle(doc, subTitle, right + 10, headerTop);
  createDate(doc, date, right + 50, headerTop + 7);

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
    doc.text(`${item.phone || "*Sin Teléfono*"}`, left + colsWidth[1], top);
    doc.text(`${item.amount_approved}`, left + colsWidth[2], top);
    doc.text(`${item.pending_due}`, left + colsWidth[3], top);
    doc.text(
      `${new Date(item.payment_date).toLocaleString("es-Es").split(",")[0]}`,
      left + colsWidth[4],
      top
    );
    doc.text(`${item.amount_of_free}`, left + colsWidth[5] + 12, top, {
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
    if (counter == itemsPerPage && index != data.length - 1) {
      doc.addPage();
      top = 40;
      renderTableHeader(doc, left, top - 10);
      counter = 0;
    }

    if (index == data.length - 1) {
      top += 5;
      createSubTitle(doc, `Totales (RD$ )`, left, top);

      createSubTitle(
        doc,
        `${currencyFormat(
          data.reduce((acc, item) => acc + parseFloat(item.amount_approved), 0),
          false
        )}`,
        left + colsWidth[2],
        top
      );
      createSubTitle(
        doc,
        `${currencyFormat(
          data.reduce((acc, item) => acc + parseFloat(item.amount_of_free), 0),
          false
        )}`,
        left + colsWidth[5] + 12,
        top,
        {
          align: "right",
        }
      );
    }
  });

  doc.save(fileName);
}

function renderTableHeader(doc, pos, top) {
  doc.rect(pos, top - 6, 220, 10);
  // pos += 3;
  createSubTitle(doc, "Cliente", pos + 1, top);
  createSubTitle(doc, "Préstamo", pos + colsWidth[0], top);
  createSubTitle(doc, "Teléfono", pos + colsWidth[1], top, "center");
  createSubTitle(doc, "Monto\nAprobado", pos + colsWidth[2], top - 2);
  createSubTitle(doc, "Cuota\nPte.", pos + colsWidth[3], top - 2);
  createSubTitle(doc, "Fecha\nPago", pos + colsWidth[4], top - 2);
  createSubTitle(doc, "Monto\nCuota", pos + colsWidth[5], top - 2);

  // pos += colsWidth[2];
  // createSubTitle(doc, "Créditos", pos, top, "center");
  // pos += colsWidth[3];
  // createSubTitle(doc, "Balance", pos, top, "center");
}

export { generateReport };
