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
import { getLoanSituationLabel } from "../stringFunctions";

let colsWidth = [25, 48, 75, 100, 127, 155, 175, 198, 220, 245];

function generateReport(data, configParams) {
  //General Configuration Params
  //-------Layout--------
  let headerTop = 20;
  let top = 40;
  let left = 10;
  let right = left + 226;
  let granTotalRight = 460;
  let rightTotal = right;
  let center = 80;
  let itemsPerPage = 35;

  //-------File settings---------
  let fileNameDate = new Date().toISOString().split("T")[0];
  let fileName = `tabla-amortizacion-${fileNameDate}.pdf`;

  const width = 215.9;
  const height = 279.4;
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [width, height],
  });

  let parentAccounts = [];

  let title = `${configParams.title}`;
  let subTitle = `TABLA AMORTIZACION`;
  let date = `${configParams.date}`;

  createMainTitle(doc, subTitle, left, headerTop - 3.5);
  //createMainSubTitle(doc, subTitle, left, headerTop);
  createDate(doc, date, right, headerTop);
  doc.text(`Cliente: ${data[0].customer_name}`, left + 65, headerTop - 5);
  doc.text(`Prestamo: ${data[0].loan_number_id}`, left + 65, headerTop);

  let counter = 0;
  renderTableHeader(doc, left, top - 10);
  data.map((item, index) => {
    //Adding one entry
    // let customerName = `${item.customer_name
    //   .split(" ")
    //   .map((item, index) => (index <= 3 ? item : undefined))
    //   .filter((item) => item != undefined)
    //   .join(" ")}`;
    doc.text(`${item.quota_number}`, left + 2, top);
    createSubTitle(
      doc,
      `${new Date(item.payment_date).toLocaleString("es-DO").split(",")[0]}`,
      left + colsWidth[0],
      top
    );
    doc.text(currencyFormat(item.capital, false), left + colsWidth[1], top);
    doc.text(currencyFormat(item.interest, false), left + colsWidth[2], top);
    doc.text(
      currencyFormat(item.amount_of_fee, false),
      left + colsWidth[3],
      top
    );
    doc.text(
      currencyFormat(item.balance_of_capital, false),
      left + colsWidth[4],
      top
    );
    doc.text(
      currencyFormat(item.total_paid_mora, false),
      left + colsWidth[5],
      top
    );
    doc.text(
      currencyFormat(
        parseFloat(item.discount_interest) + parseFloat(item.discount_mora),
        false
      ),
      left + colsWidth[6],
      top
    );
    doc.text(currencyFormat(item.total_paid, false), left + colsWidth[7], top);
    doc.text(currencyFormat(item.pending, false), left + colsWidth[8], top);
    doc.text(getLoanSituationLabel(item.status_type), left + colsWidth[9], top);

    top += spacing;
    counter++;

    if (counter == itemsPerPage) {
      doc.addPage();
      top = 40;
      renderTableHeader(doc, left, top - 10);
      counter = 0;
    }

    if (index == data.length - 1) {
      top += spacing;
      createSubTitle(doc, "Totales (RD$)", left + 2, top);

      createSubTitle(
        doc,
        currencyFormat(
          Math.round(
            data.reduce((acc, item) => acc + parseFloat(item.capital), 0)
          ),
          false
        ),
        left + colsWidth[1],
        top
      );
      createSubTitle(
        doc,
        currencyFormat(
          Math.round(
            data.reduce((acc, item) => acc + parseFloat(item.interest), 0)
          ),
          false
        ),
        left + colsWidth[2],
        top
      );
      createSubTitle(
        doc,
        currencyFormat(
          Math.round(
            data.reduce((acc, item) => acc + parseFloat(item.amount_of_fee), 0)
          ),
          false
        ),
        left + colsWidth[3],
        top
      );

      createSubTitle(
        doc,
        currencyFormat(
          Math.round(
            data.reduce(
              (acc, item) => acc + parseFloat(item.total_paid_mora),
              0
            )
          ),
          false
        ),
        left + colsWidth[5],
        top
      );
      createSubTitle(
        doc,
        currencyFormat(
          Math.round(
            data.reduce(
              (acc, item) =>
                acc +
                parseFloat(item.discount_mora) +
                parseFloat(item.discount_interest),
              0
            )
          ),
          false
        ),
        left + colsWidth[6],
        top
      );
      createSubTitle(
        doc,
        currencyFormat(
          Math.round(
            data.reduce((acc, item) => acc + parseFloat(item.total_paid), 0)
          ),
          false
        ),
        left + colsWidth[7],
        top
      );
      createSubTitle(
        doc,
        currencyFormat(
          Math.round(
            data.reduce((acc, item) => acc + parseFloat(item.pending), 0)
          ),
          false
        ),
        left + colsWidth[8],
        top
      );
    }
  });

  doc.save(fileName);
}

function renderTableHeader(doc, pos, top) {
  doc.rect(pos, top - 6, 260, 10);
  // pos += 3;
  createSubTitle(doc, "No. cuota", pos + 1, top);
  createSubTitle(doc, "Fecha\nPago", pos + colsWidth[0], top - 2);
  createSubTitle(doc, "Capital", pos + colsWidth[1], top, "center");
  createSubTitle(doc, "Interés", pos + colsWidth[2], top);
  createSubTitle(doc, "Cuota.", pos + colsWidth[3], top);
  createSubTitle(doc, "Balance\nCapital", pos + colsWidth[4], top - 2);
  createSubTitle(doc, "Mora\nPagada", pos + colsWidth[5], top - 2);
  createSubTitle(doc, "Desc.", pos + colsWidth[6], top);
  createSubTitle(doc, "Total\nPagado", pos + colsWidth[7], top - 2);
  createSubTitle(doc, "Pendiente", pos + colsWidth[8], top);
  createSubTitle(doc, "Estatus", pos + colsWidth[9], top);

  // pos += colsWidth[2];
  // createSubTitle(doc, "Créditos", pos, top, "center");
  // pos += colsWidth[3];
  // createSubTitle(doc, "Balance", pos, top, "center");
}

export { generateReport };
