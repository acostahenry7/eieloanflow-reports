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

function generateReport(data, configParams) {
  //General Configuration Params
  //-------Layout--------
  let headerTop = 10;
  let top = 40;
  let left = 20;
  let right = left + 140;
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

  let parentAccounts = ["1", "2", "3", "4", "5", "6"];

  let title = `${configParams.title}`;
  let subTitle = `BALANCE GENERAL`;
  let date = `${configParams.date}`;

  createMainTitle(doc, title, center, headerTop);
  createMainSubTitle(doc, subTitle, center + 8, headerTop + spacing + 0.8);
  createDate(doc, date, center + 14, headerTop + spacing * 2);

  //function accountSection

  //----------------------------Activos---------------------------------
  let activos = data.accounts.filter((item) => item.number == "1")[0]
    .controlledAccounts;

  createTitle(doc, "Activos", left, top);
  top += 1;
  doc.line(left, top, left + getTextWidth("Activos"), top);
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

  //Activos Fijos
  let [topAOtros, balanceAOtros] = generateReportSection(
    doc,
    activos,
    data.balances,
    "Otros Activos",
    "16",
    true,
    true,
    {
      top,
      left,
      right,
    }
  );
  top = topAOtros;

  top += sectionSpacing;
  createTitle(doc, "Total Activos", left, top);
  createTitle(
    doc,
    `${currencyFormat(
      balanceACirculantes + balanceACorrientes + balanceAFijos + balanceAOtros
    )}`,
    right,
    top
  );
  top += 1;
  doc.line(
    right,
    top,
    right +
      getTextWidth(
        `${currencyFormat(
          balanceACirculantes + balanceACorrientes + balanceAFijos
        )}`
      ),
    top
  );

  //----------------------------Pasivos---------------------------------
  let pasivos = data.accounts.filter((item) => item.number == "2")[0]
    .controlledAccounts;

  top += sectionSpacing;
  createTitle(doc, "Pasivos", left, top);
  top += 1;
  doc.line(left, top, left + getTextWidth("Pasivos"), top);

  //Pasivos Circulantes
  let [topPCirculantes, balancePCirculantes] = generateReportSection(
    doc,
    pasivos,
    data.balances,
    "Pasivos Circulantes",
    "21",
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

  let pasivosCirculantes = pasivos.filter((item) => item.number == "21")[0]
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

  console.log(pasivosCirculantes2);

  let pasivosCirculantes3 = pasivosCirculantes2.filter(
    (item) => item.number == "23"
  )[0].controlledAccounts;

  console.log(pasivosCirculantes3);

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

  let [topPCirculantes5, balancePCirculantes5] = generateReportSection(
    doc,
    pasivos,
    data.balances,
    "Pasivos circulantes",
    "25",
    false,
    false,
    {
      top,
      left,
      right,
    },
    []
  );

  top = topPCirculantes5;
  top += spacing;
  console.log(
    balancePCirculantes,
    balancePCirculantes2,
    balancePCirculantes3,
    balancePCirculantes4
  );

  let grandTotalPasivoCirculante =
    balancePCirculantes +
    balancePCirculantes2 +
    balancePCirculantes3 +
    balancePCirculantes4 +
    balancePCirculantes5;

  createSubTitle(doc, `Total Pasivos Circulantes`, left, top);
  createSubTitle(
    doc,
    `${currencyFormat(grandTotalPasivoCirculante)}`,
    right,
    top,
    {
      align: "right",
    }
  );
  top += 1;
  doc.line(
    right - getTextWidth(`${currencyFormat(grandTotalPasivoCirculante)}`),
    top,
    right,
    top
  );

  top += sectionSpacing;
  createTitle(doc, "Total Pasivos", left, top);
  createTitle(doc, `${currencyFormat(grandTotalPasivoCirculante)}`, right, top);
  top += 1;
  doc.line(
    right,
    top,
    right + getTextWidth(`${currencyFormat(grandTotalPasivoCirculante)}`),
    top
  );

  //----------------------------Capital---------------------------------
  let capital = data.accounts.filter((item) => item.number == "3")[0]
    .controlledAccounts;

  top += sectionSpacing;
  if (top + sectionSpacing > height - 100) {
    doc.addPage();
    top = 20;
  }
  createTitle(doc, "Capital", left, top);
  top += 1;
  doc.line(left, top, left + getTextWidth("Capital"), top);

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
  createSubTitle(doc, `${currencyFormat(grandTotalCapital)}`, right, top, {
    align: "right",
  });
  top += 1;
  doc.line(
    right - getTextWidth(`${currencyFormat(grandTotalCapital)}`),
    top,
    right,
    top
  );

  top += sectionSpacing;

  createTitle(doc, "Total Capital", left, top);
  createTitle(doc, `${currencyFormat(grandTotalCapital)}`, right, top);
  top += 1;
  doc.line(
    right,
    top,
    right + getTextWidth(`${currencyFormat(grandTotalCapital)}`),
    top
  );

  top += sectionSpacing;
  createTitle(doc, "Total Pasivo y Capital", left, top);
  createTitle(
    doc,
    `${currencyFormat(grandTotalPasivoCirculante + grandTotalCapital)}`,
    right,
    top
  );
  top += 1;
  doc.line(
    right,
    top,
    right +
      getTextWidth(
        `${currencyFormat(grandTotalPasivoCirculante + grandTotalCapital)}`
      ),
    top
  );

  doc.save(fileName);
}

export { generateReport };
