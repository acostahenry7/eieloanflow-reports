//-------Font--------
let baseColor = "#58585a";

//Header
let mainTitleFontSize = 14;
let mainSubTitleFontSize = mainTitleFontSize - 2;
let dateFontSize = mainSubTitleFontSize - 2;

//Body
let baseFontSize = 10;
let subtitleFontSize = baseFontSize;
let titleFontSize = baseFontSize + 2;

//------Text Layout-------
export const spacing = 5;
export const sectionSpacing = 10;

//Persistet Data
export let totalPeriod = 0;

export function createTitle(doc, text, left, top, props) {
  let color = baseColor;

  doc.setFontSize(titleFontSize);
  doc.setFont("helvetica", "normal", "bold");
  doc.setTextColor(color);
  doc.text(text, left, top, { ...props });
  doc.setTextColor(baseColor);
  doc.setFontSize(baseFontSize);
  doc.setFont("helvetica", "normal", "normal");
}

export function createSubTitle(doc, text, left, top, props) {
  let color = baseColor;

  doc.setFontSize(subtitleFontSize);
  doc.setFont("helvetica", "normal", "bold");
  doc.setTextColor(color);
  doc.text(text, left, top, { ...props });
  doc.setTextColor(baseColor);
  doc.setFontSize(baseFontSize);
  doc.setFont("helvetica", "normal", "normal");
}

export function createText(doc, text, left, top, props) {
  let color = baseColor;

  doc.setFontSize(subtitleFontSize);
  doc.setFont("helvetica", "normal", "bold");
  doc.setTextColor(color);
  doc.text(text, left, top, { ...props });
  doc.setTextColor(baseColor);
  doc.setFontSize(baseFontSize);
  doc.setFont("helvetica", "normal", "normal");
}

export function createMainTitle(doc, text, left, top, props) {
  let color = baseColor;

  doc.setFontSize(mainTitleFontSize);
  doc.setFont("helvetica", "normal", "bold");
  doc.setTextColor(color);
  doc.text(text, left, top, { ...props });
  doc.setTextColor(baseColor);
  doc.setFontSize(baseFontSize);
  doc.setFont("helvetica", "normal", "normal");
}

export function createMainSubTitle(doc, text, left, top, props) {
  let color = baseColor;

  doc.setFontSize(mainSubTitleFontSize);
  doc.setFont("helvetica", "normal", "bold");
  doc.setTextColor(color);
  doc.text(text, left, top, { ...props });
  doc.setTextColor(baseColor);
  doc.setFontSize(baseFontSize);
  doc.setFont("helvetica", "normal", "normal");
}

export function createDate(doc, text, left, top, props) {
  let color = baseColor;

  doc.setFontSize(dateFontSize);
  doc.setFont("helvetica", "normal", "bold");
  doc.setTextColor(color);
  doc.text(text, left, top, { ...props });
  doc.setTextColor(baseColor);
  doc.setFontSize(baseFontSize);
  doc.setFont("helvetica", "normal", "normal");
}

export function currencyFormat(number, showCurrencySign) {
  let options = { style: "currency", currency: "DOP" };

  if (showCurrencySign == false) {
    options = {};
  }

  return new Intl.NumberFormat("es-DO", options).format(number);
}

export function generateReportSection(
  doc,
  mainList,
  mainBalances,
  sectionName,
  parentNum,
  showSectionName,
  printTotal,
  options,
  notShowAccounts
) {
  let sectionData = mainList.filter((item) => item.number == parentNum)[0]
    .controlledAccounts;

  let alwaysVisibleAccounts = ["34", "3601", "37", "32"];
  if (notShowAccounts?.length > 0) {
    let tempArr = [];
    sectionData.forEach((item) => {
      if (!notShowAccounts?.filter((ac) => ac == item.number).length > 0) {
        tempArr.push(item);
      }
    });

    sectionData = tempArr;
  }

  let { left, right, top } = options;

  if (showSectionName == true) {
    top += sectionSpacing;
    createSubTitle(doc, `${sectionName}`, left, top);
  }

  let totalBalance = 0;

  for (let i = 0; i < sectionData.length; i++) {
    let balance = mainBalances.filter(
      (item) => item.account_catalog_id == sectionData[i].account_catalog_id
    )[0].balance;

    totalBalance += balance;

    if (sectionData[i].is_control == false) {
      balance += parseInt(sectionData[i].balance);

      totalBalance += balance;
    }

    let isVisible =
      alwaysVisibleAccounts.filter(
        (account) => account == sectionData[i].number
      ).length > 0;

    if (sectionData[i].number == "3601") {
      top += spacing;
      doc.text(`RESULTADO DEL PERIODO`, left, top);
      doc.text(`${currencyFormat(totalPeriod)}`, right, top, {
        align: "right",
      });
      totalBalance += totalPeriod;
    }

    if (balance > 0 || isVisible == true) {
      top += spacing;
      doc.text(`${sectionData[i].name}`, left, top);
      doc.text(`${currencyFormat(balance)}`, right, top, {
        align: "right",
      });
    }
  }

  if (printTotal == true) {
    top += spacing;
    createSubTitle(doc, `Total ${sectionName}`, left, top);
    createSubTitle(doc, `${currencyFormat(totalBalance)}`, right, top, {
      align: "right",
    });

    doc.line(
      right - getTextWidth(`${currencyFormat(totalBalance)}`),
      top + 1,
      right,
      top + 1
    );
  }

  return [top, totalBalance];
}

export function generateResultStatusReportSection(
  doc,
  mainList,
  mainBalances,
  sectionName,
  parentNum,
  showSectionName,
  printTotal,
  options,
  notShowAccounts
) {
  let sectionData = mainList.filter((item) => item.number == parentNum)[0]
    .controlledAccounts;

  if (notShowAccounts?.length > 0) {
    let tempArr = [];
    sectionData.forEach((item) => {
      if (!notShowAccounts?.filter((ac) => ac == item.number).length > 0) {
        tempArr.push(item);
      }
    });

    sectionData = tempArr;
  }

  let { left, right, top } = options;

  if (showSectionName == true) {
    top += sectionSpacing;
    createSubTitle(doc, `${sectionName}`, left, top);
  }

  let totalBalance = 0;
  let totalPrevBalance = 0;

  for (let i = 0; i < sectionData.length; i++) {
    let balance = mainBalances.filter(
      (item) => item.account_catalog_id == sectionData[i].account_catalog_id
    )[0].balance;
    let prevBalance = mainBalances.filter(
      (item) => item.account_catalog_id == sectionData[i].account_catalog_id
    )[0].prevBalance;

    totalBalance += balance;
    totalPrevBalance += prevBalance;

    if (balance >= 0 || prevBalance > 0) {
      top += spacing;
      doc.text(`${sectionData[i].name}`, left, top);
      doc.text(`${currencyFormat(balance)}`, right + 46, top, {
        align: "right",
      });

      if (options.isResultStatus) {
        doc.text(`${currencyFormat(prevBalance)}`, right + 4, top, {
          align: "right",
        });
      }
    }

    if (i == 31) {
      doc.addPage();
      top = 20;
    }
  }

  if (printTotal == true) {
    top += spacing;
    createSubTitle(doc, `Total ${sectionName}`, left, top);
    createSubTitle(doc, `${currencyFormat(totalBalance)}`, right + 46, top, {
      align: "right",
    });

    doc.line(
      right + 46 - getTextWidth(`${currencyFormat(totalBalance)}`),
      top + 1,
      right + 46,
      top + 1
    );

    createSubTitle(doc, `${currencyFormat(totalPrevBalance)}`, right + 4, top, {
      align: "right",
    });

    doc.line(
      right + 4 - getTextWidth(`${currencyFormat(totalPrevBalance)}`),
      top + 1,
      right + 4,
      top + 1
    );
  }

  totalPeriod = totalBalance;
  return [top, totalBalance, totalPrevBalance];
}

export function getTextWidth(text) {
  // Choose a factor based on your font and rendering
  let factor = 0.24;

  // Estimate the width based on the length of the string
  let estimatedWidth = text.length * baseFontSize * factor;

  return estimatedWidth;
}
