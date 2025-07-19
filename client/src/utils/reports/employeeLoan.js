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
import {
  getCustomerEstatusLabel,
  getLoanFrequencyLabel,
  getLoanSituationLabel,
  getLoanTypeLabel,
} from "../stringFunctions";

let colsWidth = [50, 75, 100, 125, 150, 175, 200, 225];

function generateReport(data, configParams) {
  //General Configuration Params
  //-------Layout--------
  let headerTop = 20;
  let top = 40;
  let left = 10;
  let right = left + 80;
  let granTotalRight = 460;
  let rightTotal = right;
  let center = 80;
  let itemsPerPage = 52;

  //-------File settings---------
  let fileNameDate = new Date().toISOString().split("T")[0];
  let fileName = `prestamos-empleados-${fileNameDate}.pdf`;

  const width = 215.9;
  const height = 279.4;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [width, height],
  });

  let parentAccounts = [];

  let title = `${configParams.title}`;
  let subTitle = `REPORTE DE PRESTAMOS A EMPLEADOS`;
  let date = `${configParams.date}`;

  createMainTitle(doc, title, right + 31, headerTop - 5);
  createMainSubTitle(doc, subTitle, right + 31, headerTop);
  createDate(doc, date, right + 87, headerTop + 7);

  doc.addImage(logo, "png", left, headerTop - 15, 100, 25);

  top += 10;
  let counter = 0;
  renderTableHeader(doc, left, top - 10);
  data.map((item, index) => {
    //Adding one entry
    let employeeName = `${item.employee_name
      .split(" ")
      .map((item, index) => (index <= 3 ? item : undefined))
      .filter((item) => item != undefined)
      .join(" ")}`;
    doc.text(`${employeeName}`, left, top);
    doc.text(`${item.identification}`, left + colsWidth[0], top);
    doc.text(`${item.loan_number}`, left + colsWidth[1], top);
    createSubTitle(
      doc,
      `${new Date(item.created_date).toLocaleString("es-DO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })}`,
      left + colsWidth[2],
      top
    );
    doc.text(`${item.amount_approved}`, left + colsWidth[3], top);
    doc.text(`${item.number_of_installments}`, left + colsWidth[4] + 10, top, {
      align: "right",
    });
    doc.text(`${item.amount_of_free}`, left + colsWidth[5] + 10, top, {
      align: "right",
    });
    // doc.text(`${item.arrears_dues}`, left + colsWidth[5] + 10, top, {
    //   align: "right",
    // });
    // doc.text(
    //   `${getLoanFrequencyLabel(item.frequency_of_payment)}`,
    //   left + colsWidth[6] + 14,
    //   top,
    //   {
    //     align: "right",
    //   }
    // );
    // createSubTitle(
    //   doc,
    //   `${item.arrear_percentaje}%`,
    //   left + colsWidth[7],
    //   top,
    //   {
    //     align: "right",
    //   }
    // );
    // doc.text(`${item.arrear_percentaje}%`, left + 155, top);
    // doc.text(
    //   `${new Date(item.defeated_since).toLocaleString("es-Es").split(",")[0]}`,
    //   left + 180,
    //   top
    // );
    // doc.text(`${item.defeated_amount}`, left + 210, top);
    top += spacing;
    counter++;

    let pageInfo = doc.internal.getCurrentPageInfo();
    if (counter == itemsPerPage - 5 && pageInfo.pageNumber == 1) {
      doc.addPage();
      top = 20;
      renderTableHeader(doc, left, top - 10);
      counter = 0;
    }
    if (counter == itemsPerPage) {
      doc.addPage();
      top = 20;
      renderTableHeader(doc, left, top - 10);
      counter = 0;
    }
  });

  doc.save(fileName);
}

function renderTableHeader(doc, pos, top) {
  doc.rect(pos, top - 6, 200, 10);
  // pos += 3;
  createSubTitle(doc, "Empleado", pos + 1, top);
  createSubTitle(doc, "Cédula", pos + colsWidth[0], top);
  createSubTitle(doc, "Préstamo", pos + colsWidth[1], top);
  createSubTitle(doc, "Fecha", pos + colsWidth[2], top);
  createSubTitle(doc, "Monto\nPréstamo", pos + colsWidth[3], top - 2);
  createSubTitle(doc, "Cantidad\nCuotas", pos + colsWidth[4], top - 2);
  createSubTitle(doc, "Monto\nCuotas", pos + colsWidth[5], top - 2);
  //createSubTitle(doc, "Monto\nCuotas", pos + colsWidth[6], top);
  //createSubTitle(doc, "Cuotas\nPendientes", pos + colsWidth[7], top);

  // createSubTitle(doc, "Cuotas\nAtraso", pos + colsWidth[5], top - 2);
  // createSubTitle(doc, "Freq. de\nPago", pos + colsWidth[6], top - 2);
  // createSubTitle(doc, "Porcentaje\nAtraso", pos + colsWidth[7] - 19, top - 2);
  // pos += colsWidth[2];
  // createSubTitle(doc, "Créditos", pos, top, "center");
  // pos += colsWidth[3];
  // createSubTitle(doc, "Balance", pos, top, "center");
}

export { generateReport };
