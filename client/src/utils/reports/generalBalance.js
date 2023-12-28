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

//------Text Layout-------
let spacing = 15;
let sectionSpacing = 25;

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
  let subTitle = `BALANCE GENERAL`;
  let date = "Diciembre 2023";

  createMainTitle(doc, title, center, headerTop);
  createMainSubTitle(doc, subTitle, center + 20, headerTop + 15);
  createDate(doc, date, center + 40, headerTop + 30);

  //----------------------------Activos---------------------------------
  let activos = data.accounts.filter((item) => item.number == "1")[0]
    .controlledAccounts;

  createTitle(doc, "Activos", left, top);
  //Activos circulantes
  let [topACirculantes, balanceACirculantes] = generateReportSection(
    doc,
    activos,
    data.balances,
    "Activos Circulantes",
    "11",
    true,
    true,
    {
      top,
      left,
      right,
    }
  );
  top = topACirculantes;

  //Activos corrientes
  let [topACorrientes, balanceACorrientes] = generateReportSection(
    doc,
    activos,
    data.balances,
    "Activos Corrientes",
    "12",
    true,
    true,
    {
      top,
      left,
      right,
    }
  );
  top = topACorrientes;

  //Activos Fijos
  let [topAFijos, balanceAFijos] = generateReportSection(
    doc,
    activos,
    data.balances,
    "Activos Fijos",
    "14",
    true,
    true,
    {
      top,
      left,
      right,
    }
  );
  top = topAFijos;

  top += sectionSpacing;
  createTitle(doc, "Total Activos", left, top);
  createTitle(
    doc,
    `${currencyFormat(
      balanceACirculantes + balanceACorrientes + balanceAFijos
    )}`,
    right,
    top
  );

  //----------------------------Pasivos---------------------------------
  let pasivos = data.accounts.filter((item) => item.number == "2")[0]
    .controlledAccounts;

  top += sectionSpacing;
  createTitle(doc, "Pasivos", left, top);

  //Pasivos Circulantes
  let [topPCirculantes, balancePCirculantes] = generateReportSection(
    doc,
    pasivos,
    data.balances,
    "Pasivos Circulantes",
    "2-1",
    true,
    false,
    {
      top,
      left,
      right,
    },
    ["22"]
  );

  top = topPCirculantes;
  console.log("top", top);

  let pasivosCirculantes = pasivos.filter((item) => item.number == "2-1")[0]
    .controlledAccounts;

  let [topPCirculantes2, balancePCirculantes2] = generateReportSection(
    doc,
    pasivosCirculantes,
    data.balances,
    undefined,
    "22",
    false,
    false,
    {
      top,
      left,
      right,
    },
    ["23"]
  );

  top = topPCirculantes2;

  let pasivosCirculantes2 = pasivosCirculantes.filter(
    (item) => item.number == "22"
  )[0].controlledAccounts;

  let [topPCirculantes3, balancePCirculantes3] = generateReportSection(
    doc,
    pasivosCirculantes2,
    data.balances,
    "Pasivos circulantes",
    "23",
    false,
    false,
    {
      top,
      left,
      right,
    },
    ["24"]
  );

  top = topPCirculantes3;

  let pasivosCirculantes3 = pasivosCirculantes2.filter(
    (item) => item.number == "23"
  )[0].controlledAccounts;

  let [topPCirculantes4, balancePCirculantes4] = generateReportSection(
    doc,
    pasivosCirculantes3,
    data.balances,
    "Pasivos circulantes",
    "24",
    false,
    false,
    {
      top,
      left,
      right,
    },
    []
  );

  top = topPCirculantes4;

  top += spacing;

  let grandTotalPasivoCirculante =
    balancePCirculantes +
    balancePCirculantes2 +
    balancePCirculantes3 +
    balancePCirculantes4;

  createSubTitle(doc, `Total Pasivos Circulantes`, left, top);
  createSubTitle(
    doc,
    `${currencyFormat(grandTotalPasivoCirculante)}`,
    right,
    top
  );

  top += sectionSpacing;
  createTitle(doc, "Total Pasivos", left, top);
  createTitle(doc, `${currencyFormat(grandTotalPasivoCirculante)}`, right, top);

  //----------------------------Capital---------------------------------
  let capital = data.accounts.filter((item) => item.number == "3")[0]
    .controlledAccounts;

  top += sectionSpacing;
  createTitle(doc, "Capital", left, top);
  //Capital
  let [topCapital1, balanceCapital1] = generateReportSection(
    doc,
    data.accounts,
    data.balances,
    "Capital, Reserva y Superavit",
    "3",
    true,
    false,
    {
      top,
      left,
      right,
    },
    ["36", "38"]
  );

  top = topCapital1;

  let [topCapital2, balanceCapital2] = generateReportSection(
    doc,
    capital,
    data.balances,
    "Capital, Reserva y Superavit",
    "36",
    false,
    false,
    {
      top,
      left,
      right,
    }
  );

  top = topCapital2;

  let [topCapital3, balanceCapital3] = generateReportSection(
    doc,
    capital,
    data.balances,
    "Capital, Reserva y Superavit",
    "38",
    false,
    false,
    {
      top,
      left,
      right,
    }
  );

  top = topCapital3;

  top += spacing;

  let grandTotalCapital = balanceCapital1 + balanceCapital2 + balanceCapital3;

  createSubTitle(doc, `Total Capital, Reserva y Superavit`, left, top);
  createSubTitle(doc, `${currencyFormat(grandTotalCapital)}`, right, top);

  top += sectionSpacing;

  createTitle(doc, "Total Capital", left, top);
  createTitle(doc, `${currencyFormat(grandTotalCapital)}`, right, top);

  top += sectionSpacing;
  createTitle(doc, "Total Pasivo y Capital", left, top);
  createTitle(
    doc,
    `${currencyFormat(grandTotalPasivoCirculante + grandTotalCapital)}`,
    right,
    top
  );

  doc.save(fileName);
}

export { generateReport };
