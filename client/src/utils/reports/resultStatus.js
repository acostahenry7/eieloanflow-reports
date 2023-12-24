import { jsPDF } from "jspdf";

//General Configuration Params

//Text
let spacing = 15;
let sectionSpacing = 10;

function generateReport(arr) {
  //Layout
  let top = 100;
  let left = 30;
  let right = 400;
  let rightTotal = right;
  let center = 320;
  let itemsPerPage = 44;

  //Font
  let baseColor = "#58585a";

  let mainTitleFontSize = 20;
  let mainSubTitleFontSize = mainTitleFontSize - 2;
  let dateFontSize = mainSubTitleFontSize - 2;
  let baseFontSize = 10;
  let subtitleFontSize = baseFontSize;
  let titleFontSize = baseFontSize + 4;

  const width = 816;
  const height = 1054;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [width, height],
  });

  function createMainTitle(text, left, top, color) {
    if (!color) color = baseColor;

    doc.setFontSize(mainTitleFontSize);
    doc.setFont("helvetica", "normal", "bold");
    doc.setTextColor(color);
    doc.text(text, left, top);
    doc.setTextColor(baseColor);
    doc.setFontSize(baseFontSize);
    doc.setFont("helvetica", "normal", "normal");
  }
  function createMainSubTitle(text, left, top, color) {
    if (!color) color = baseColor;

    doc.setFontSize(mainSubTitleFontSize);
    doc.setFont("helvetica", "normal", "bold");
    doc.setTextColor(color);
    doc.text(text, left, top);
    doc.setTextColor(baseColor);
    doc.setFontSize(baseFontSize);
    doc.setFont("helvetica", "normal", "normal");
  }
  function createDate(text, left, top, color) {
    if (!color) color = baseColor;

    doc.setFontSize(dateFontSize);
    doc.setFont("helvetica", "normal", "bold");
    doc.setTextColor(color);
    doc.text(text, left, top);
    doc.setTextColor(baseColor);
    doc.setFontSize(baseFontSize);
    doc.setFont("helvetica", "normal", "normal");
  }

  function createTitle(text, left, top, color) {
    if (!color) color = baseColor;

    doc.setFontSize(titleFontSize);
    doc.setFont("helvetica", "normal", "bold");
    doc.setTextColor(color);
    doc.text(text, left, top);
    doc.setTextColor(baseColor);
    doc.setFontSize(baseFontSize);
    doc.setFont("helvetica", "normal", "normal");
  }

  function createSubTitle(text, left, top, color) {
    if (!color) color = baseColor;

    doc.setFontSize(subtitleFontSize);
    doc.setFont("helvetica", "normal", "bold");
    doc.setTextColor(color);
    doc.text(text, left, top);
    doc.setTextColor(baseColor);
    doc.setFontSize(baseFontSize);
    doc.setFont("helvetica", "normal", "normal");
  }

  let parentAccounts = [];

  let title = `SOLUCIONES TAVERAS`;
  let subTitle = `ESTADO DE RESULTADOS`;
  let date = "AL 23 DE DICIEMBRE 2023";

  createMainTitle(title, center, 30);
  createMainSubTitle(subTitle, center, 45);
  createDate(date, center + 10, 60);

  for (var i = 0; i < arr.length; i++) {
    if (arr[i].is_control == true && arr[i].control_account == null) {
      top = top + sectionSpacing;
      createTitle(`${arr[i].number} ${arr[i].name}`, left, top);
      createTitle(`${currencyFormat(arr[i].balance)}`, rightTotal, top);
      top = top + sectionSpacing;
      parentAccounts = [];
    } else {
      console.log(arr[i].number, arr[i].control_account);
      if (arr[i].is_control == true && arr[i].control_account != null) {
        //Reder total by account groups
        if (parentAccounts.length > 0) {
          createTitle(
            `Total ${parentAccounts[parentAccounts.length - 1].name}`,
            left,
            top
          );
          createTitle(
            `${currencyFormat(
              parentAccounts[parentAccounts.length - 1].balance
            )}`,
            rightTotal,
            top
          );
          top = top + spacing;
        }

        parentAccounts.push(arr[i]);

        createSubTitle(`${arr[i].number} ${arr[i].name}`, left, top);
        // doc.text(`${currencyFormat(arr[i].balance)}`, right, top);
      } else {
        let repeat = 232 - left - arr[i].name.length * 2.5;
        //   arr[i].balance.toString().length * 2;

        doc.text(`${arr[i].number} ${arr[i].name}`, left, top);
        doc.text(`${currencyFormat(arr[i].balance)}`, right, top);

        // doc.text(
        //   `${"*".repeat(repeat)}`,
        //   left + arr[i].name.length * 6,
        //   top + 4
        // );
        // doc.text(`${i}`, 190, top);
      }
    }

    if (i > itemsPerPage) {
      doc.addPage();
      itemsPerPage += itemsPerPage;
      top = 60;
    }

    top = top + spacing;
  }

  doc.save("reporte-estado-de-resultado.pdf");
}

function currencyFormat(number) {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
  }).format(number);
}

export { generateReport };
