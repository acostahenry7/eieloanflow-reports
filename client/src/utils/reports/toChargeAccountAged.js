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
import { getLoanTypeLabel, getLoanSituationLabel } from "../stringFunctions";

let colsWidth = [70, 90, 105, 132, 160, 185, 210, 240];

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
  let fileName = `CxC-por-antiguedad-de-saldo-${fileNameDate}.pdf`;

  const width = 215.9;
  const height = 279.4;
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [width, height],
  });

  let parentAccounts = [];

  let title = `${configParams.title}`;
  let subTitle = `CUENTAS POR COBRAR POR ANTIGUEDAD DE SALDO`;
  let date = `${configParams.date}`;

  createMainTitle(doc, title, left, headerTop - 5);
  createMainSubTitle(doc, subTitle, left, headerTop);
  createDate(doc, date, right + 80, headerTop);

  let counter = 0;
  renderTableHeader(doc, left, top - 10);
  data
    .filter(
      (item) =>
        parseInt(item.thirty_days) > 0 ||
        parseInt(item.one_or_two_months) > 0 ||
        parseInt(item.two_or_three_months) > 0 ||
        parseInt(item.three_or_six_months) > 0 ||
        parseInt(item.six_or_twelve_months) > 0 ||
        parseInt(item.more_than_year) > 0
    )
    .map((item, index) => {
      //Adding one entry
      let customerName = `${item.customer_name
        .split(" ")
        .map((item, index) => (index <= 3 ? item : undefined))
        .filter((item) => item != undefined)
        .join(" ")}`;
      doc.text(`${customerName}`, left, top);
      createSubTitle(doc, `${item.loan_number_id}`, left + colsWidth[0], top);
      doc.text(`${getLoanTypeLabel(item.loan_type)}`, left + colsWidth[1], top);
      doc.text(
        `${currencyFormat(item.thirty_days, false)}`,
        left + colsWidth[2] + 15,
        top,
        {
          align: "right",
        }
      );
      doc.text(
        `${currencyFormat(item.one_or_two_months, false)}`,
        left + colsWidth[3] + 12,
        top,
        { align: "right" }
      );
      doc.text(
        `${currencyFormat(item.two_or_three_months || 0, false)}`,
        left + colsWidth[4] + 12,
        top,
        {
          align: "right",
        }
      );
      doc.text(
        `${currencyFormat(item.three_or_six_months, false)}`,
        left + colsWidth[5] + 12,
        top,
        { align: "right" }
      );
      doc.text(
        `${currencyFormat(item.six_or_twelve_months || 0, false)}`,
        left + colsWidth[6] + 16,
        top,
        { align: "right" }
      );
      doc.text(
        `${currencyFormat(item.more_than_year || 0, false)}`,
        left + colsWidth[7] + 16,
        top,
        { align: "right" }
      );
      top += spacing;
      counter++;

      if (
        index ==
        data.filter(
          (item) =>
            parseInt(item.thirty_days) > 0 ||
            parseInt(item.one_or_two_months) > 0 ||
            parseInt(item.two_or_three_months) > 0 ||
            parseInt(item.three_or_six_months) > 0 ||
            parseInt(item.six_or_twelve_months) > 0 ||
            parseInt(item.more_than_year) > 0
        ).length -
          1
      ) {
        createSubTitle(doc, "Total (RD$): ", left + 2, top + 5);
        createSubTitle(
          doc,
          currencyFormat(
            data.reduce(
              (acc, element) => acc + parseFloat(element.thirty_days),
              0
            ),
            false
          ),
          left + colsWidth[2] + 15,
          top + 5,
          { align: "right" }
        );
        createSubTitle(
          doc,
          currencyFormat(
            data.reduce(
              (acc, element) => acc + parseFloat(element.one_or_two_months),
              0
            ),
            false
          ),
          left + colsWidth[3] + 13,
          top + 5,
          { align: "right" }
        );
        createSubTitle(
          doc,
          currencyFormat(
            data.reduce(
              (acc, element) => acc + parseFloat(element.two_or_three_months),
              0
            ),
            false
          ),
          left + colsWidth[4] + 13,
          top + 5,
          { align: "right" }
        );
        createSubTitle(
          doc,
          currencyFormat(
            data.reduce(
              (acc, element) => acc + parseFloat(element.three_or_six_months),
              0
            ),
            false
          ),
          left + colsWidth[5] + 13,
          top + 5,
          { align: "right" }
        );
        createSubTitle(
          doc,
          currencyFormat(
            data.reduce(
              (acc, element) =>
                acc + parseFloat(element.six_or_twelve_months || 0),
              0
            ),
            false
          ),
          left + colsWidth[6] + 16,
          top + 5,
          { align: "right" }
        );
        createSubTitle(
          doc,
          currencyFormat(
            data.reduce(
              (acc, element) => acc + parseFloat(element.more_than_year || 0),
              0
            ),
            false
          ),
          left + colsWidth[7] + 16,
          top + 5,
          { align: "right" }
        );
      }
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
  createSubTitle(doc, "Tipo\nPréstamo", pos + colsWidth[1], top - 2);
  createSubTitle(doc, "De 1 a 30 dias", pos + colsWidth[2], top - 2);
  createSubTitle(doc, "De 1 a 2 meses.", pos + colsWidth[3], top - 2);
  createSubTitle(doc, "De 2 a 3 meses", pos + colsWidth[4], top - 2);
  createSubTitle(doc, "De 3 a 6 meses", pos + colsWidth[5], top - 2);
  createSubTitle(doc, "De 1/2 a 1 año", pos + colsWidth[6] + 5, top - 2);
  createSubTitle(doc, "Más de 1 año", pos + colsWidth[7] + 5, top - 2);

  // pos += colsWidth[2];
  // createSubTitle(doc, "Créditos", pos, top, "center");
  // pos += colsWidth[3];
  // createSubTitle(doc, "Balance", pos, top, "center");
}

export { generateReport };
