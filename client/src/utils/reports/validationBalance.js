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

let colsWidth = [20, 107, 132, 157, 182, 207, 232];

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
  let itemsPerPage = 34;

  //-------File settings---------
  let fileNameDate = new Date().toISOString().split("T")[0];
  let fileName = `balance-de-comprobacion-${fileNameDate}.pdf`;

  const width = 215.9;
  const height = 279.4;
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [width, height],
  });

  let parentAccounts = [];

  let title = `${configParams.title}`;
  let subTitle = `BALANCE DE COMPROBACION`;
  let date = `${configParams.date || ""}`;

  createMainTitle(doc, title, left, headerTop);
  createMainSubTitle(doc, subTitle, left, headerTop + 5);
  createMainSubTitle(doc, date, left, headerTop + 10);

  createSubTitle(
    doc,
    "Balance Anterior (RD$)",
    left + colsWidth[2] - 19,
    headerTop + 12
  );
  createSubTitle(
    doc,
    "Movimiento del  Mes (RD$)",
    left + colsWidth[4] - 18,
    headerTop + 12
  );
  createSubTitle(
    doc,
    "Acumulado (RD$)",
    left + colsWidth[5] + 12,
    headerTop + 12
  );
  //---------------------- TRANSACTIONS--------------------
  let counter = 0;
  renderTableHeader(doc, left, top - 10);
  left += 1;
  data.map((item, index) => {
    createSubTitle(doc, `${item.number}`, left, top);
    doc.text(`${item.name}`, left + colsWidth[0], top);
    doc.text(
      `${currencyFormat(item.prev_debit, false)}`,
      left + colsWidth[1] + 15,
      top,
      {
        align: "right",
      }
    );
    doc.text(
      `${currencyFormat(item.prev_credit, false)}`,
      left + colsWidth[2] + 15,
      top,
      {
        align: "right",
      }
    );
    doc.text(
      `${currencyFormat(item.mov_debit, false)}`,
      left + colsWidth[3] + 15,
      top,
      {
        align: "right",
      }
    );
    doc.text(
      `${currencyFormat(item.mov_credit, false)}`,
      left + colsWidth[4] + 15,
      top,
      {
        align: "right",
      }
    );
    doc.text(
      `${currencyFormat(item.total_debit, false)}`,
      left + colsWidth[5] + 15,
      top,
      {
        align: "right",
      }
    );
    doc.text(
      `${currencyFormat(item.total_credit, false)}`,
      left + colsWidth[6] + 15,
      top,
      {
        align: "right",
      }
    );

    top += spacing;
    counter++;
    if (counter == itemsPerPage && index < data.length - 1) {
      doc.addPage();
      top = 40;

      createSubTitle(
        doc,
        "Balance Anterior (RD$)",
        left + colsWidth[2] - 19,
        headerTop + 12
      );
      createSubTitle(
        doc,
        "Movimiento del  Mes (RD$)",
        left + colsWidth[4] - 18,
        headerTop + 12
      );
      createSubTitle(
        doc,
        "Acumulado (RD$)",
        left + colsWidth[5] + 12,
        headerTop + 12
      );
      renderTableHeader(doc, left, top - 10);
      counter = 0;
    }

    if (index == data.length - 1) {
      if (top > 215 - 20) {
        doc.addPage();
        top = 40;
      }

      createSubTitle(
        doc,
        "Balance Anterior (RD$)",
        left + colsWidth[2] - 19,
        headerTop + 12
      );
      createSubTitle(
        doc,
        "Movimiento del  Mes (RD$)",
        left + colsWidth[4] - 18,
        headerTop + 12
      );
      createSubTitle(
        doc,
        "Acumulado (RD$)",
        left + colsWidth[5] + 12,
        headerTop + 12
      );
      if (top > 215 - 20) renderTableHeader(doc, left, top - 10);
      createSubTitle(doc, `Totales`, left, top);
      createSubTitle(
        doc,
        `${currencyFormat(
          data.reduce((acc, item) => acc + parseFloat(item.prev_debit), 0),
          false
        )}`,
        left + colsWidth[1] + 15,
        top,
        {
          align: "right",
        }
      );
      createSubTitle(
        doc,
        `${currencyFormat(
          data.reduce((acc, item) => acc + parseFloat(item.prev_credit), 0),
          false
        )}`,
        left + colsWidth[2] + 15,
        top,
        {
          align: "right",
        }
      );
      createSubTitle(
        doc,
        `${currencyFormat(
          data.reduce((acc, item) => acc + parseFloat(item.mov_debit), 0),
          false
        )}`,
        left + colsWidth[3] + 15,
        top,
        {
          align: "right",
        }
      );
      createSubTitle(
        doc,
        `${currencyFormat(
          data.reduce((acc, item) => acc + parseFloat(item.mov_credit), 0),
          false
        )}`,
        left + colsWidth[4] + 15,
        top,
        {
          align: "right",
        }
      );
      createSubTitle(
        doc,
        `${currencyFormat(
          data.reduce((acc, item) => acc + parseFloat(item.total_debit), 0),
          false
        )}`,
        left + colsWidth[5] + 15,
        top,
        {
          align: "right",
        }
      );
      createSubTitle(
        doc,
        `${currencyFormat(
          data.reduce((acc, item) => acc + parseFloat(item.total_credit), 0),
          false
        )}`,
        left + colsWidth[6] + 15,
        top,
        {
          align: "right",
        }
      );
    }
  });

  console.log(counter);

  doc.save(fileName);
}

function renderTableHeader(doc, pos, top) {
  doc.rect(pos, top - 6, 250, 10);
  pos += 3;
  createSubTitle(doc, "No.\nCuenta", pos, top - 2, "center");
  createSubTitle(
    doc,
    "Detalle de la Transacción / Descripción",
    pos + colsWidth[0],
    top,
    "center"
  );
  createSubTitle(doc, "Débito", pos + colsWidth[1], top, "center");

  createSubTitle(doc, "Crédito", pos + colsWidth[2], top, "center");

  createSubTitle(doc, "Débito", pos + colsWidth[3], top, "center");

  createSubTitle(doc, "Crédito", pos + colsWidth[4], top, "center");

  createSubTitle(doc, "Débito", pos + colsWidth[5], top, "center");
  createSubTitle(doc, "Crédito", pos + colsWidth[6], top, "center");
}

export { generateReport };
