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

let colsWidth = [40, 80, 135, 162, 190, 215, 240];

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
  let fileName = `conciliacion-bancaria-${fileNameDate}.pdf`;

  const width = 215.9;
  const height = 279.4;
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [width, height],
  });

  let parentAccounts = [];

  let title = `${configParams.title}`;
  let subTitle = `CONCILIACION BANCARIA`;
  let date = `${configParams.date} al ${configParams.dateTo}`;

  createMainTitle(doc, title, left, headerTop - 5);
  createMainSubTitle(doc, subTitle, left, headerTop);
  createDate(doc, date, right + 30, headerTop);

  createTitle(doc, "Cuenta de banco", right + 80 - 40, headerTop + 10);
  createSubTitle(
    doc,
    data.bankTransactions[0]?.bank_account,
    right + 80,
    headerTop + 10
  );

  console.log(data.bankTransactions);
  let totalBankBalance = data.bankTransactions.reduce(
    (acc, i) =>
      i.transaction_type == "CR"
        ? acc + parseFloat(i.amount)
        : acc - parseFloat(i.amount),
    0
  );

  createTitle(doc, "Balance en Banco", left, headerTop + 10);
  createSubTitle(
    doc,
    currencyFormat(totalBankBalance),
    left + 43,
    headerTop + 10
  );

  createTitle(doc, "Depósitos en tránsito", left, top);
  top += spacing + 5;
  renderTableHeader(doc, left, top);

  const transitDeposits = [];
  data.bankTransactions.map((bt) => {
    bt.transactions
      .filter(
        (t) => t.transaction_type == "ENTRY" && t.status_type == "TRANSIT"
      )
      .map((t) => {
        transitDeposits.push(t);
      });
  });

  top += 10;

  if (transitDeposits.length == 0) {
    doc.text("No hay depositos en tránsito", left, top);
  }

  transitDeposits.map((deposit) => {
    doc.text(`${deposit.target_date}`, left, top);
    doc.text(
      `${currencyFormat(deposit.diary_amount, false)}`,
      left + colsWidth[0],
      top
    );
    doc.text(`${deposit.diary_description}`, left + colsWidth[1], top);
    top += spacing;
  });
  top += 5;
  createSubTitle(doc, "Total", left, top);
  const totalTransitDeposits = transitDeposits.reduce(
    (acc, i) => acc + parseFloat(i.diary_amount),
    0
  );
  doc.text(`${currencyFormat(totalTransitDeposits)}`, left + 15, top);
  top += 10;

  createTitle(doc, "Cheques en tránsito", left, top);
  top += spacing + 5;
  renderTableHeader(doc, left, top);
  const transitChecks = [];
  console.log(data);
  data.bankTransactions.map((bt) => {
    bt.transactions
      .filter(
        (t) => t.transaction_type != "ENTRY" && t.status_type == "TRANSIT"
      )
      .map((t) => {
        transitChecks.push(t);
      });
  });

  top += 10;

  console.log("$$", transitChecks);
  if (transitChecks.length == 0) {
    doc.text("No hay cheques en tránsito", left, top);
  }

  transitChecks.map((deposit) => {
    doc.text(`${deposit.target_date}`, left, top);
    doc.text(
      `${currencyFormat(deposit.diary_amount, false)}`,
      left + colsWidth[0],
      top
    );
    doc.text(`${deposit.diary_description}`, left + colsWidth[1], top);
    top += spacing;
  });
  top += 5;
  createSubTitle(doc, "Total", left, top);
  const totalTransitChecks = transitChecks.reduce(
    (acc, i) => acc + parseFloat(i.diary_amount),
    0
  );
  doc.text(`${currencyFormat(totalTransitChecks)}`, left + 15, top);

  top += 10;
  createTitle(doc, "Resumen", left, top);
  top += 10;
  createSubTitle(
    doc,
    "Balance en banco ((+/-)transacciones en transito)",
    left,
    top
  );
  doc.text(
    currencyFormat(
      `${totalBankBalance + totalTransitDeposits - totalTransitChecks}`
    ),
    100,
    top
  );
  top += 5;
  createSubTitle(doc, "Balance en diario", left, top);
  let allLocalTransactions = [];
  data.bankTransactions.map((bt) => {
    bt.transactions.map((t) => {
      allLocalTransactions.push(t);
    });
  });
  doc.text(
    currencyFormat(
      `${allLocalTransactions.reduce(
        (acc, i) =>
          i.transaction_type == "ENTRY"
            ? acc + parseFloat(i.diary_amount)
            : acc - parseFloat(i.diary_amount),
        0
      )}`
    ),
    100,
    top
  );
  //   renderTableHeader(doc, left, top - 10);
  //   data.map((item, index) => {
  //     //Adding one entry
  //     let customerName = `${item.customer_name
  //       .split(" ")
  //       .map((item, index) => (index <= 3 ? item : undefined))
  //       .filter((item) => item != undefined)
  //       .join(" ")}`;
  //     doc.text(`${customerName}`, left, top);
  //     createSubTitle(doc, `${item.loan_number_id}`, left + colsWidth[0], top);
  //     doc.text(`${getLoanTypeLabel(item.loan_type)}`, left + colsWidth[1], top);
  //     doc.text(
  //       `${currencyFormat(item.total_due, false)}`,
  //       left + colsWidth[2] + 15,
  //       top,
  //       {
  //         align: "right",
  //       }
  //     );
  //     doc.text(
  //       `${currencyFormat(item.total_paid_capital, false)}`,
  //       left + colsWidth[3] + 12,
  //       top,
  //       { align: "right" }
  //     );
  //     doc.text(
  //       `${currencyFormat(item.total_paid_interest || 0, false)}`,
  //       left + colsWidth[4] + 12,
  //       top,
  //       {
  //         align: "right",
  //       }
  //     );
  //     doc.text(
  //       `${currencyFormat(item.total_paid, false)}`,
  //       left + colsWidth[5] + 12,
  //       top,
  //       { align: "right" }
  //     );
  //     doc.text(
  //       `${currencyFormat(item.total_pending || 0, false)}`,
  //       left + colsWidth[6] + 16,
  //       top,
  //       { align: "right" }
  //     );
  //     top += spacing;
  //     counter++;

  //     if (index == data.length - 1) {
  //       createSubTitle(doc, "Total (RD$): ", left + 2, top + 5);
  //       createSubTitle(
  //         doc,
  //         currencyFormat(
  //           data.reduce((acc, element) => acc + parseFloat(element.total_due), 0),
  //           false
  //         ),
  //         left + colsWidth[2] + 15,
  //         top + 5,
  //         { align: "right" }
  //       );
  //       createSubTitle(
  //         doc,
  //         currencyFormat(
  //           data.reduce(
  //             (acc, element) => acc + parseFloat(element.total_paid_capital),
  //             0
  //           ),
  //           false
  //         ),
  //         left + colsWidth[3] + 13,
  //         top + 5,
  //         { align: "right" }
  //       );
  //       createSubTitle(
  //         doc,
  //         currencyFormat(
  //           data.reduce(
  //             (acc, element) => acc + parseFloat(element.total_paid_interest),
  //             0
  //           ),
  //           false
  //         ),
  //         left + colsWidth[4] + 13,
  //         top + 5,
  //         { align: "right" }
  //       );
  //       createSubTitle(
  //         doc,
  //         currencyFormat(
  //           data.reduce(
  //             (acc, element) => acc + parseFloat(element.total_paid),
  //             0
  //           ),
  //           false
  //         ),
  //         left + colsWidth[5] + 13,
  //         top + 5,
  //         { align: "right" }
  //       );
  //       createSubTitle(
  //         doc,
  //         currencyFormat(
  //           data.reduce(
  //             (acc, element) => acc + parseFloat(element.total_pending || 0),
  //             0
  //           ),
  //           false
  //         ),
  //         left + colsWidth[6] + 16,
  //         top + 5,
  //         { align: "right" }
  //       );
  //     }
  //     if (counter == itemsPerPage) {
  //       doc.addPage();
  //       top = 40;
  //       renderTableHeader(doc, left, top - 10);
  //       counter = 0;
  //     }
  //   });

  doc.save(fileName);
}

function renderTableHeader(doc, pos, top) {
  doc.rect(pos, top - 6, 260, 10);
  // pos += 3;
  createSubTitle(doc, "Fecha", pos + 1, top);
  createSubTitle(doc, "Monto", pos + colsWidth[0], top);
  createSubTitle(doc, "Descripción", pos + colsWidth[1], top);
  //   createSubTitle(doc, "Total\nAdeudado", pos + colsWidth[2], top - 2);
  //   createSubTitle(doc, "Capital\nCobrado.", pos + colsWidth[3], top - 2);
  //   createSubTitle(doc, "Interés\nCobrado", pos + colsWidth[4], top - 2);
  //   createSubTitle(doc, "Total\nCobrado", pos + colsWidth[5], top - 2);
  //   createSubTitle(doc, "Por\nCobrar", pos + colsWidth[6] + 5, top - 2);

  // pos += colsWidth[2];
  // createSubTitle(doc, "Créditos", pos, top, "center");
  // pos += colsWidth[3];
  // createSubTitle(doc, "Balance", pos, top, "center");
}

export { generateReport };
