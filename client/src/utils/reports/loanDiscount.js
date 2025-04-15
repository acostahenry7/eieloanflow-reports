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

let colsWidth = [70, 100, 140, 175, 235];

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
  let fileName = `descuentos-al-prestamo-${fileNameDate}.pdf`;

  const width = 215.9;
  const height = 279.4;
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [width, height],
  });

  let parentAccounts = [];

  let title = `${configParams.title}`;
  let subTitle = `DESCUENTOS A PRESTAMOS`;
  let date = `${configParams.date}`;

  createMainTitle(doc, title, right + 27, headerTop - 5);
  createMainSubTitle(doc, subTitle, right + 27, headerTop);
  createDate(doc, date, right + 80, headerTop + 10);

  doc.addImage(logo, "png", left, headerTop - 15, 100, 25);

  top += 10;

  let counter = 0;
  renderTableHeader(doc, left, top - 10);
  data.map((item) => {
    //Adding one entry
    let customerName = `${item.customer_name
      ?.split(" ")
      .map((item, index) => (index <= 3 ? item : undefined))
      .filter((item) => item != undefined)
      .join(" ")}`;
    doc.text(`${customerName}`, left, top);
    doc.text(`${item.loan_number_id}`, left + colsWidth[0], top);
    doc.text(`${item.action_type}`, left + colsWidth[1], top);
    doc.text(`${item.commentary || "No comentario"}`, left + colsWidth[2], top);
    doc.text(`${item.employee_name}`, left + colsWidth[3], top);
    doc.text(
      `${new Date(item.created_date).toLocaleString("es-Es").split(",")[0]}`,
      left + colsWidth[4] + 11,
      top,
      { align: "right" }
    );

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
      doc.addPage();
      top = 40;
      renderTableHeader(doc, left, top - 10);
      counter = 0;
    }
  });

  doc.save(fileName);
}

function renderTableHeader(doc, pos, top) {
  doc.rect(pos, top - 6, 250, 10);
  // pos += 3;
  createSubTitle(doc, "Cliente", pos + 1, top);
  createSubTitle(doc, "Préstamo", pos + colsWidth[0], top);
  createSubTitle(doc, "Accion", pos + colsWidth[1], top, "center");
  createSubTitle(doc, "Comentario", pos + colsWidth[2], top);
  createSubTitle(doc, "Empleado", pos + colsWidth[3], top);
  createSubTitle(doc, "Fecha", pos + colsWidth[4], top);

  // pos += colsWidth[2];
  // createSubTitle(doc, "Créditos", pos, top, "center");
  // pos += colsWidth[3];
  // createSubTitle(doc, "Balance", pos, top, "center");
}

export { generateReport };
