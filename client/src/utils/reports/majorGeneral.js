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

let colsWidth = [30, 92, 27, 27];

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
  let fileName = `mayor-general-${fileNameDate}.pdf`;

  const width = 215.9;
  const height = 279.4;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [width, height],
  });

  let parentAccounts = [];

  let title = `${configParams.title}`;
  let subTitle = `MAYOR GENERAL`;
  let date = `${configParams.date || ""}`;

  createMainTitle(doc, title, right, headerTop);
  createMainSubTitle(doc, subTitle, right, headerTop + 5);
  createMainSubTitle(doc, date, right, headerTop + 10);

  //---------------------- TRANSACTIONS--------------------
  let counter = 0;
  parsedData.map((account, acIndex) => {
    createTitle(doc, "Cuenta No.", right + 23, headerTop + 18, {
      align: "right",
    });
    createTitle(doc, account[0], right + 38, headerTop + 18, {
      align: "right",
    });
    renderTableHeader(doc, left, top);
    top += sectionSpacing;
    account[1].map((transaction, index) => {
      counter += 1;
      doc.text(transaction.created_date.split("T")[0], left + 3, top);
      doc.text(transaction.description, left + colsWidth[0] + 3, top);
      createSubTitle(
        doc,
        transaction.debit,
        left + colsWidth[0] + colsWidth[1] + 17,
        top,
        {
          align: "right",
        }
      );
      createSubTitle(
        doc,
        transaction.credit,
        left + colsWidth[0] + colsWidth[1] + colsWidth[2] + 17,
        top,
        { align: "right" }
      );
      createSubTitle(
        doc,
        `${transaction.debit - transaction.credit}`,
        left + colsWidth[0] + colsWidth[1] + colsWidth[2] + colsWidth[3] + 17,
        top,
        { align: "right" }
      );
      top += spacing;
      if (counter == itemsPerPage) {
        top = 40;
        doc.addPage();
        renderTableHeader(doc, left, top);
        top += sectionSpacing;
        counter = 0;
      }
    });

    if (acIndex != parsedData.length - 1) {
      counter = 0;
      doc.addPage();
      top = 40;
    }
  });

  console.log(counter);

  doc.save(fileName);
}

function renderTableHeader(doc, pos, top) {
  doc.rect(pos, top - 6, 195, 10);
  pos += 3;
  createSubTitle(doc, "Fecha Asiento", pos, top, "center");
  pos += colsWidth[0];
  createSubTitle(
    doc,
    "Detalle de la Transacción / Descripción",
    pos,
    top,
    "center"
  );
  pos += colsWidth[1];
  createSubTitle(doc, "Débitos", pos, top, "center");
  pos += colsWidth[2];
  createSubTitle(doc, "Créditos", pos, top, "center");
  pos += colsWidth[3];
  createSubTitle(doc, "Balance", pos, top, "center");
}

export { generateReport };
