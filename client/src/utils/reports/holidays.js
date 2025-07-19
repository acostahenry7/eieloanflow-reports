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

let colsWidth = [50, 85, 140, 180, 225, 256];

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
  let fileName = `reporte-${
    configParams.type == "DF" ? `dias-feriados` : "horas-extra"
  }-${fileNameDate}.pdf`;

  const width = 215.9;
  const height = 279.4;
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [width, height],
  });

  let parentAccounts = [];

  let title = `${configParams.title}`;
  let subTitle = `REPORTE PAGO ${
    configParams.type == "DF" ? "DIAS FERIADOS" : "HORAS EXRA"
  }`;
  let date = `${configParams.date}`;

  top += 15;

  createMainTitle(doc, title, right + 50, headerTop);
  createMainSubTitle(doc, subTitle, right + 50, headerTop + 5);
  createMainSubTitle(doc, date, right + 50, headerTop + 10);
  doc.addImage(logo, "png", left, headerTop - 10, 100, 25);

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
    createSubTitle(doc, `${item.identification}`, left + colsWidth[0], top);
    doc.text(`${item.department}`, left + colsWidth[1], top);
    doc.text(`${item.position}`, left + colsWidth[2], top);
    doc.text(`${currencyFormat(item.salary, false)}`, left + colsWidth[3], top);
    // doc.text(`${item.phone}`, left + colsWidth[4] + 10, top, {
    //   align: "right",
    // });
    doc.text(`${item.amount_entry}`, left + colsWidth[4] + 10, top, {
      align: "right",
    });
    // doc.text(
    //   `${item.sex == "MALE" ? "Hombre" : "Mujer"}`,
    //   left + colsWidth[5] + 10,
    //   top,
    //   {
    //     align: "right",
    //   }
    // );
    // createSubTitle(
    //   doc,
    //   `${item.status_type == "ENABLED" ? "Activo" : "Inactivo"}`,
    //   left + colsWidth[5] + 2,
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
  createSubTitle(doc, "Empleado", pos + 1, top);
  createSubTitle(doc, "Identificación", pos + colsWidth[0], top);
  createSubTitle(doc, "Departamento", pos + colsWidth[1], top, "center");
  createSubTitle(doc, "Cargo", pos + colsWidth[2], top);
  createSubTitle(doc, "Salario", pos + colsWidth[3], top);
  //   createSubTitle(doc, "Teléfono", pos + colsWidth[4], top);
  createSubTitle(doc, "Monto a\nPagar", pos + colsWidth[4], top - 2);
  //   createSubTitle(doc, "Sexo", pos + colsWidth[5], top);
  //createSubTitle(doc, "Estatus", pos + colsWidth[5] - 10, top);
  // pos += colsWidth[2];
  // createSubTitle(doc, "Créditos", pos, top, "center");
  // pos += colsWidth[3];
  // createSubTitle(doc, "Balance", pos, top, "center");
}

export { generateReport };
