//-------Font--------
let baseColor = "#58585a";

//Header
let mainTitleFontSize = 20;
let mainSubTitleFontSize = mainTitleFontSize - 2;
let dateFontSize = mainSubTitleFontSize - 2;

//Body
let baseFontSize = 14;
let subtitleFontSize = baseFontSize + 2;
let titleFontSize = baseFontSize + 4;

//------Text Layout-------
let spacing = 15;
let sectionSpacing = 25;

export function createTitle(doc, text, left, top, color) {
  if (!color) color = baseColor;

  doc.setFontSize(titleFontSize);
  doc.setFont("helvetica", "normal", "bold");
  doc.setTextColor(color);
  doc.text(text, left, top);
  doc.setTextColor(baseColor);
  doc.setFontSize(baseFontSize);
  doc.setFont("helvetica", "normal", "normal");
}

export function createSubTitle(doc, text, left, top, color) {
  if (!color) color = baseColor;

  doc.setFontSize(subtitleFontSize);
  doc.setFont("helvetica", "normal", "bold");
  doc.setTextColor(color);
  doc.text(text, left, top);
  doc.setTextColor(baseColor);
  doc.setFontSize(baseFontSize);
  doc.setFont("helvetica", "normal", "normal");
}

export function createMainTitle(doc, text, left, top, color) {
  if (!color) color = baseColor;

  doc.setFontSize(mainTitleFontSize);
  doc.setFont("helvetica", "normal", "bold");
  doc.setTextColor(color);
  doc.text(text, left, top);
  doc.setTextColor(baseColor);
  doc.setFontSize(baseFontSize);
  doc.setFont("helvetica", "normal", "normal");
}

export function createMainSubTitle(doc, text, left, top, color) {
  if (!color) color = baseColor;

  doc.setFontSize(mainSubTitleFontSize);
  doc.setFont("helvetica", "normal", "bold");
  doc.setTextColor(color);
  doc.text(text, left, top);
  doc.setTextColor(baseColor);
  doc.setFontSize(baseFontSize);
  doc.setFont("helvetica", "normal", "normal");
}

export function createDate(doc, text, left, top, color) {
  if (!color) color = baseColor;

  doc.setFontSize(dateFontSize);
  doc.setFont("helvetica", "normal", "bold");
  doc.setTextColor(color);
  doc.text(text, left, top);
  doc.setTextColor(baseColor);
  doc.setFontSize(baseFontSize);
  doc.setFont("helvetica", "normal", "normal");
}

export function currencyFormat(number) {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
  }).format(number);
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

    if (balance > 0) {
      top += spacing;
      doc.text(`${sectionData[i].name}`, left, top);
      doc.text(`${currencyFormat(balance)}`, right, top);
    }
  }

  if (printTotal == true) {
    top += spacing;
    createSubTitle(doc, `Total ${sectionName}`, left, top);
    createSubTitle(doc, `${currencyFormat(totalBalance)}`, right, top);
  }

  return [top, totalBalance];
}
