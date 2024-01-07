import { jsPDF } from "jspdf";
import {
  createTitle,
  createSubTitle,
  createMainTitle,
  createMainSubTitle,
  createDate,
  currencyFormat,
  generateReportSection,
  generateResultStatusReportSection,
  spacing,
  sectionSpacing,
} from "./report-helpers";
import moment from "moment";
import esLocale from "moment/locale/es";
import { monthsOfYear } from "../ui-helpers";
moment.locale("fr", [esLocale]);

//General Configuration Params

function generateReport(data, configParams) {
  //General Configuration Params
  //-------Layout--------
  let headerTop = 10;
  let top = 40;
  let left = 20;
  let right = left + 120;
  let granTotalRight = 460;
  let rightTotal = right;
  let center = 80;
  let itemsPerPage = 44;

  //-------File settings---------
  let fileNameDate = new Date().toISOString().split("T")[0];
  let fileName = `balance-general-${fileNameDate}.pdf`;

  const width = 215.9;
  const height = 279.4;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [width, height],
  });

  let parentAccounts = [];

  let title = `${configParams.title}`;
  let subTitle = `ESTADO DE RESULTADO`;
  let date = `Al ${configParams.date}`;

  createMainTitle(doc, title, center, headerTop);
  createMainSubTitle(doc, subTitle, center + 5, headerTop + spacing + 0.8);
  createDate(doc, date, center + 9, headerTop + spacing * 2);

  // let ingresos = data.accounts.filter((item) => item.number == "4")[0]
  //   .controlledAccounts;

  renderTableHeader(doc, left, top, configParams);
  console.log(data.accounts);

  //------------------------Ingresos-------------------------
  let [topIngresos, balanceIngresos, prevBalanceIngresos] =
    generateResultStatusReportSection(
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
        isResultStatus: true,
      }
    );

  top = topIngresos;

  //Ingresos Acumulado

  //------------------------Gastos-------------------------
  let [topGastos, balanceGastos, prevBalanceGastos] =
    generateResultStatusReportSection(
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
        isResultStatus: true,
      }
    );

  top = topGastos;
  top += sectionSpacing + 5;

  console.log(balanceGastos);
  createTitle(doc, "Total del periodo", left, top);
  createTitle(
    doc,
    currencyFormat(prevBalanceIngresos - prevBalanceGastos),
    right - 22,
    top
  );
  createTitle(
    doc,
    currencyFormat(balanceIngresos - balanceGastos),
    right + 20,
    top
  );

  doc.save("reporte-estado-de-resultado.pdf");
}

function renderTableHeader(doc, pos, top, configParams) {
  // doc.rect(pos, top - 6, 195, 10);
  // pos += 3;

  let currentMonth = parseInt(
    configParams.fixedDate.toISOString().split("T")[0].split("-")[1]
  );

  pos += 104;
  createSubTitle(
    doc,
    `${monthsOfYear[currentMonth].toUpperCase()}`,
    pos,
    top,
    "center"
  );
  pos += 35;
  createSubTitle(
    doc,
    `ENERO-${monthsOfYear[currentMonth].toUpperCase()}`,
    pos,
    top,
    "center"
  );
}

export { generateReport };
