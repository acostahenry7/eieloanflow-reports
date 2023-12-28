import { jsPDF } from "jspdf";
import {
  createTitle,
  createSubTitle,
  createMainTitle,
  createMainSubTitle,
  createDate,
  currencyFormat,
  generateReportSection,
} from "./report-helpers";

//General Configuration Params

//Text
let spacing = 15;
let sectionSpacing = 10;

function generateReport(data, configParams) {
  //General Configuration Params
  //-------Layout--------
  let headerTop = 80;
  let top = 180;
  let left = 200;
  let right = left + 300;
  let granTotalRight = 460;
  let rightTotal = right;
  let center = 320;
  let itemsPerPage = 44;

  //-------File settings---------
  let fileNameDate = new Date().toISOString().split("T")[0];
  let fileName = `balance-general-${fileNameDate}.pdf`;

  const width = 816;
  const height = 1054;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [width, height],
  });

  let parentAccounts = [];

  let title = `${configParams.title}`;
  let subTitle = `ESTADO DE RESULTADO`;
  let date = "Diciembre 2023";

  createMainTitle(doc, title, center, 30);
  createMainSubTitle(doc, subTitle, center, 45);
  createDate(doc, date, center + 10, 60);

  // let ingresos = data.accounts.filter((item) => item.number == "4")[0]
  //   .controlledAccounts;

  //------------------------Ingresos-------------------------
  let [topIngresos, balanceIngresos] = generateReportSection(
    doc,
    data.accounts,
    data.balances,
    "Ingresos",
    "4",
    true,
    true,
    {
      top,
      left,
      right,
    }
  );

  top = topIngresos;

  //------------------------Gastos-------------------------
  let [topGastos, balanceGastos] = generateReportSection(
    doc,
    data.accounts,
    data.balances,
    "Gastos",
    "6",
    true,
    true,
    {
      top,
      left,
      right,
    }
  );

  top = topGastos;

  // for (var i = 0; i < arr.length; i++) {
  //   if (arr[i].is_control == true && arr[i].control_account == null) {
  //     top = top + sectionSpacing;
  //     createTitle(`${arr[i].number} ${arr[i].name}`, left, top);
  //     createTitle(`${currencyFormat(arr[i].balance)}`, rightTotal, top);
  //     top = top + sectionSpacing;
  //     parentAccounts = [];
  //   } else {
  //     console.log(arr[i].number, arr[i].control_account);
  //     if (arr[i].is_control == true && arr[i].control_account != null) {
  //       //Reder total by account groups
  //       if (parentAccounts.length > 0) {
  //         createTitle(
  //           `Total ${parentAccounts[parentAccounts.length - 1].name}`,
  //           left,
  //           top
  //         );
  //         createTitle(
  //           `${currencyFormat(
  //             parentAccounts[parentAccounts.length - 1].balance
  //           )}`,
  //           rightTotal,
  //           top
  //         );
  //         top = top + spacing;
  //       }

  //       parentAccounts.push(arr[i]);

  //       createSubTitle(`${arr[i].number} ${arr[i].name}`, left, top);
  //       // doc.text(`${currencyFormat(arr[i].balance)}`, right, top);
  //     } else {
  //       let repeat = 232 - left - arr[i].name.length * 2.5;
  //       //   arr[i].balance.toString().length * 2;

  //       doc.text(`${arr[i].number} ${arr[i].name}`, left, top);
  //       doc.text(`${currencyFormat(arr[i].balance)}`, right, top);

  //       // doc.text(
  //       //   `${"*".repeat(repeat)}`,
  //       //   left + arr[i].name.length * 6,
  //       //   top + 4
  //       // );
  //       // doc.text(`${i}`, 190, top);
  //     }
  //   }

  //   if (i > itemsPerPage) {
  //     doc.addPage();
  //     itemsPerPage += itemsPerPage;
  //     top = 60;
  //   }

  //   top = top + spacing;
  // }

  doc.save("reporte-estado-de-resultado.pdf");
}

export { generateReport };
