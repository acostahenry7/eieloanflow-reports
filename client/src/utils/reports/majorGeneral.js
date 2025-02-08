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
  getDiaryDescription,
} from "./report-helpers";

import logo from "./images/logo";

let colsWidth = [25, 25, 130, 27, 27];

function generateReport(data, configParams) {
  let parsedData = data;

  //General Configuration Params
  //-------Layout--------
  let headerTop = 10;
  let top = 40;
  let left = 10;
  let right = left + 130;
  let granTotalRight = 460;
  let rightTotal = right;
  let center = 80;
  let itemsPerPage = 30;

  //-------File settings---------
  let fileNameDate = new Date().toISOString().split("T")[0];
  let fileName = `mayor-general-${fileNameDate}.pdf`;

  const width = 215.9;
  const height = 279.4;
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [width, height],
  });

  let parentAccounts = [];

  let title = `${configParams.title}`;
  let subTitle = `MAYOR GENERAL`;
  let date = `${configParams.date || ""}`;

  createMainTitle(doc, title, right + 50, headerTop);
  createMainSubTitle(doc, subTitle, right + 50, headerTop + 5);
  createMainSubTitle(doc, date, right + 50, headerTop + 10);

  doc.addImage(logo, "png", left + 2, headerTop - 5, 100, 25);

  // createMainSubTitle(
  //   doc,
  //   `Cajero: ${parsedData[0].account.employee_name}`,
  //   left,
  //   headerTop + 5
  // );

  //---------------------- TRANSACTIONS--------------------
  let counter = 0;
  console.log(parsedData);
  let origin = "";
  parsedData.map((pd, acIndex) => {
    //console.log(pd);
    // createTitle(doc, pd.account.name, right + 42, headerTop + 18, {
    //   align: "right",
    // });
    createTitle(
      doc,
      `${pd.account.name} ${pd.account.number}`,
      right + 50,
      headerTop + 18,
      {
        align: "left",
      }
    );

    origin = getAccountOrigin(pd.account.number);
    renderTableHeader(doc, left, top);
    top += sectionSpacing;

    let currentTotalDebit = 0;
    let currentTotalCredit = 0;
    let currentTotalBalance = 0;

    //adding previous balance

    console.log(
      configParams.previousBalances[0],
      "vs",
      configParams.currentAccount
    );

    if (pd.transactions[0].isFirst == true) {
      pd.transactions.shift();
    }

    const obj = configParams.previousBalances.find(
      (item) => item.number == pd.account.number
    );

    if (obj) {
      obj.isFirst = true;
      obj.description = "Balance al mes anterior";
      obj.created_date = "";

      console.log(obj);

      pd.transactions.unshift(obj);
    }

    pd.transactions.map((transaction, index) => {
      counter += 1;
      let description =
        transaction.deposit_description ||
        transaction.check_description ||
        getDiaryDescription(transaction.description);

      doc.text(transaction.created_date.split("T")[0], left + 3, top);
      doc.text(transaction.reference_bank || "", left + colsWidth[0] + 3, top);
      // doc.text(
      //   `${description[0] || ""} ${description[1] || ""} ${
      //     description[2] || ""
      //   } ${description[3] || ""}${description[4] || ""}  ${
      //     description[5] || ""
      //   } ${description[6] || ""}`,
      //   left + colsWidth[0] + 3,
      //   top
      // );
      doc.text(description, left + colsWidth[0] + colsWidth[1] + 4, top);
      createSubTitle(
        doc,
        currencyFormat(transaction.debit, false),
        left + colsWidth[0] + colsWidth[1] + colsWidth[2] + 17,
        top,
        {
          align: "right",
        }
      );
      createSubTitle(
        doc,
        currencyFormat(transaction.credit, false),
        left + colsWidth[0] + colsWidth[1] + colsWidth[2] + colsWidth[3] + 17,
        top,
        { align: "right" }
      );

      createSubTitle(
        doc,
        `${currencyFormat(
          transaction.balance || getRowBalance(pd.transactions, index, origin),
          false
        )}`,
        left +
          colsWidth[0] +
          colsWidth[1] +
          colsWidth[2] +
          colsWidth[3] +
          colsWidth[4] +
          17,
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

      currentTotalDebit += parseFloat(transaction.debit);
      currentTotalCredit += parseFloat(transaction.credit);
      if (origin == "debit") {
        currentTotalBalance +=
          parseFloat(transaction.debit) - parseFloat(transaction.credit);
      } else {
        currentTotalBalance +=
          parseFloat(transaction.credit) - parseFloat(transaction.debit);
      }

      if (index == pd.transactions.length - 1) {
        createSubTitle(doc, "Totales (RD$)", left + 2, top + 4);
        createSubTitle(
          doc,
          `${currencyFormat(currentTotalDebit, false)}`,
          left + colsWidth[0] + colsWidth[1] + colsWidth[2] + 17,
          top + 4,
          {
            align: "right",
          }
        );
        createSubTitle(
          doc,
          `${currencyFormat(currentTotalCredit, false)}`,
          left + colsWidth[0] + colsWidth[1] + colsWidth[2] + colsWidth[3] + 17,
          top + 4,
          {
            align: "right",
          }
        );
        createSubTitle(
          doc,
          `${currencyFormat(currentTotalBalance, false)}`,
          left +
            colsWidth[0] +
            colsWidth[1] +
            colsWidth[2] +
            colsWidth[3] +
            colsWidth[4] +
            17,
          top + 4,
          {
            align: "right",
          }
        );
      }
    });

    if (acIndex != parsedData.length - 1) {
      counter = 0;
      doc.addPage();
      top = 40;
    } else {
      // createSubTitle(doc, "Totales (RD$)", left + 2, top + 10);
      // createSubTitle(
      //   doc,
      //   currencyFormat(
      //     Math.round(
      //       pd.transactions.reduce(
      //         (acc, item) => acc + parseFloat(item.debit),
      //         0.0
      //       )
      //     ),
      //     false
      //   ),
      //   left + colsWidth[1] + 30,
      //   top + 10,
      //   {
      //     align: "right",
      //   }
      // );
      // createSubTitle(
      //   doc,
      //   currencyFormat(
      //     Math.round(
      //       pd.transactions.reduce(
      //         (acc, item) => acc + parseFloat(item.credit),
      //         0
      //       )
      //     ),
      //     false
      //   ),
      //   left + colsWidth[0] + colsWidth[1] + colsWidth[2],
      //   top + 10
      // );
      // createSubTitle(
      //   doc,
      //   currencyFormat(
      //     Math.round(
      //       pd.transactions.reduce(
      //         (acc, item) => acc + parseFloat(item.debit - item.credit),
      //         0
      //       )
      //     ),
      //     false
      //   ),
      //   left + colsWidth[0] + colsWidth[1] + colsWidth[2] + colsWidth[3],
      //   top + 10
      // );
    }
  });

  console.log(counter);

  doc.save(fileName);
}

function renderTableHeader(doc, pos, top) {
  doc.rect(pos + 2, top - 6, 252, 10);
  pos += 3;
  createSubTitle(doc, "Fecha\nAsiento", pos, top - 2, "center");
  pos += colsWidth[0];
  createSubTitle(doc, "No.\nDocumento ", pos, top - 2, "center");
  pos += colsWidth[1];
  createSubTitle(
    doc,
    "Detalle de la Transacción / Descripción",
    pos,
    top,
    "center"
  );
  pos += colsWidth[2];
  createSubTitle(doc, "Débitos", pos, top, "center");
  pos += colsWidth[3];
  createSubTitle(doc, "Créditos", pos, top, "center");
  pos += colsWidth[4];
  createSubTitle(doc, "Balance", pos, top, "center");
}

function getRowBalance(arr, row, origin) {
  let acumDebit = arr
    .filter((item, index) => index <= row)
    .reduce((acc, item) => acc + parseFloat(item.debit), 0);

  let acumCredit = arr
    .filter((item, index) => index <= row)
    .reduce((acc, item) => acc + parseFloat(item.credit), 0);

  let balance = 0;
  if (origin == "debit") {
    balance = acumDebit - acumCredit;
  } else {
    balance = acumCredit - acumDebit;
  }

  return balance;
}

function getAccountOrigin(account) {
  let numberParent = account[0];
  let origin = "";
  switch (numberParent) {
    case "1":
      origin = "debit";
      break;
    case "2":
      origin = "credit";
      break;
    case "3":
      origin = "credit";
      break;
    case "4":
      origin = "credit";
      break;
    case "6":
      origin = "debit";
      break;

    default:
      break;
  }

  return origin;
}

export { generateReport };
