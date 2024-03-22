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
import { groupBy } from "lodash";

let colsWidth = [40, 70, 100, 127, 152, 184, 214, 237];
let innerColsWidth = [30, 105, 180, 210, 240];

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
  let itemsPerPage = 28;

  //-------File settings---------
  let fileNameDate = new Date().toISOString().split("T")[0];
  let fileName = `cierre-de-caja-${fileNameDate}.pdf`;

  const width = 215.9;
  const height = 279.4;
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [width, height],
  });

  let parentAccounts = [];

  let title = `${configParams.title}`;
  let subTitle = `CIERRE DE CAJA`;
  let date = `${configParams.date}`;

  createMainTitle(doc, title, left, headerTop - 5);
  createMainSubTitle(doc, subTitle, left, headerTop);
  createDate(doc, date, right + 87, headerTop);

  let counter = 0;
  renderTableHeader(doc, left, top - 10);
  data.map((item, acIndex) => {
    let employeeName = `${item.register.employee_name
      ?.split(" ")
      .map((item, index) => (index <= 3 ? item : undefined))
      .filter((item) => item != undefined)
      .join(" ")}`;
    doc.text(`${employeeName}`, left, top);
    doc.text(`${item.child.length}`, left + colsWidth[0] + 23, top, {
      align: "right",
    });
    doc.text(
      `${currencyFormat(item.register.amount, false)}`,
      left + colsWidth[1] + 13,
      top,
      { align: "right" }
    );
    doc.text(
      `${currencyFormat(item.register.total_cash, false)}`,
      left + colsWidth[2] + 13,
      top,
      { align: "right" }
    );
    doc.text(
      `${currencyFormat(item.register.total_check, false)}`,
      left + colsWidth[3] + 14,
      top,
      { align: "right" }
    );
    doc.text(
      `${currencyFormat(item.register.total_transfer, false)}`,
      left + colsWidth[4] + 23,
      top,
      { align: "right" }
    );
    doc.text(
      `${currencyFormat(item.register.total_discount, false)}`,
      left + colsWidth[5] + 17,
      top,
      { align: "right" }
    );
    doc.text(
      `${currencyFormat(item.register.total_pay, false)}`,
      left + colsWidth[6] + 13,
      top,
      { align: "right" }
    );
    doc.text(
      `${
        new Date(item.register.opening_date)
          .toLocaleString("es-Es")
          .split(",")[0]
      }`,
      left + colsWidth[7] + 15,
      top,
      { align: "right" }
    );
    //renderTableHeader(doc, left, top);
    top += sectionSpacing;
    createSubTitle(doc, "Transacciones", left, top);
    createSubTitle(doc, "Diferencia: ", left + 50, top);
    // createSubTitle(
    //   doc,
    //   currencyFormat(
    //     item.child.reduce((acc, element) => acc + parseFloat(element.pay), 0) -
    //       parseFloat(item.register.total_pay)
    //   ),
    //   left + 93,
    //   top,
    //   { align: "right" }
    // );
    createSubTitle(
      doc,
      currencyFormat(item.register.difference, false),
      left + 93,
      top,
      { align: "right" }
    );
    createSubTitle(doc, "Descuento: ", left + 100, top);
    createSubTitle(
      doc,
      currencyFormat(item.register.total_discount, false),
      left + 143,
      top,
      { align: "right" }
    );
    top += sectionSpacing;
    //-----------------INNER TRANSACTION-----------------
    renderInnerTableHeader(doc, left, top);
    top += sectionSpacing;
    item.child.map((innerItem, innerIndex) => {
      counter += 1;
      let customerName = `${innerItem.customer_name
        ?.split(" ")
        .map((item, index) => (index <= 3 ? item : undefined))
        .filter((item) => item != undefined)
        .join(" ")}`;

      doc.text(`${innerItem.loan_number_id}`, left + 2, top);
      doc.text(`${innerItem.outlet}`, left + innerColsWidth[0], top);
      doc.text(`${customerName}`, left + innerColsWidth[1], top);
      doc.text(
        `${currencyFormat(innerItem.pay, false)}`,
        left + innerColsWidth[2] + 10,
        top,
        { align: "right" }
      );

      switch (innerItem.payment_type) {
        case "CASH":
          innerItem.payment_type = "Efectivo";
          break;
        case "CHECK":
          innerItem.payment_type = "Cheque";
          break;
        case "TRANSFER":
          innerItem.payment_type = "Transferencia";
          break;
        default:
          innerItem.payment_type = "Efectivo";
          break;
      }
      doc.text(
        `${innerItem.payment_type}`,
        left + innerColsWidth[3] + 10,
        top,
        { align: "right" }
      );
      doc.text(
        `${
          new Date(innerItem.created_date).toLocaleString("es-Es").split(",")[0]
        }`,
        left + innerColsWidth[4] + 15,
        top,
        { align: "right" }
      );

      top += spacing;

      if (innerIndex == item.child.length - 1) {
        createSubTitle(doc, "Total ", left + 2, top + 5);
        createSubTitle(
          doc,
          currencyFormat(
            item.child.reduce(
              (acc, element) => acc + parseFloat(element.pay),
              0
            )
          ),
          left + innerColsWidth[2] + 10,
          top + 5,
          { align: "right" }
        );

        top += 5;
        Object.entries(groupBy(item.child, "outlet")).map(
          (outletItem, index) => {
            createSubTitle(
              doc,
              `Total ${outletItem[0]} `,
              left + 2,
              top + (index + 2) * 5
            );
            createSubTitle(
              doc,
              currencyFormat(
                outletItem[1].reduce(
                  (acc, element) => acc + parseFloat(element.pay),
                  0
                )
              ),
              left + innerColsWidth[2] + 10,
              top + (index + 2) * 5,
              { align: "right" }
            );
          }
        );
      }

      if (counter == itemsPerPage) {
        doc.addPage();
        top = 40;
        renderInnerTableHeader(doc, left, top - 10);
        counter = 0;
      }
    });

    if (acIndex != data.length - 1) {
      counter = 0;
      doc.addPage();
      top = 40;
      renderTableHeader(doc, left, top - 10);
    }
  });

  doc.save(fileName);
}

function renderTableHeader(doc, pos, top) {
  doc.rect(pos, top - 6, 260, 10);
  // pos += 3;
  createSubTitle(doc, "Empleado", pos + 1, top);
  createSubTitle(doc, "Número De\nTransacciones", pos + colsWidth[0], top - 2);
  createSubTitle(doc, "Total\nApertura", pos + colsWidth[1], top - 2);
  createSubTitle(doc, "Total\nEfectivo", pos + colsWidth[2], top - 2);
  createSubTitle(doc, "Total\nCheques", pos + colsWidth[3], top - 2);
  createSubTitle(doc, "Total\nTransferencia", pos + colsWidth[4], top - 2);
  createSubTitle(doc, "Total\nDescuento", pos + colsWidth[5], top - 2);
  createSubTitle(doc, "Total\nPagado", pos + colsWidth[6], top - 2);
  createSubTitle(doc, "Fecha\nApertura", pos + colsWidth[7], top - 2);

  // pos += colsWidth[2];
  // createSubTitle(doc, "Créditos", pos, top, "center");
  // pos += colsWidth[3];
  // createSubTitle(doc, "Balance", pos, top, "center");
}

function renderInnerTableHeader(doc, pos, top) {
  doc.rect(pos, top - 6, 260, 10);
  // pos += 3;
  createSubTitle(doc, "Préstamo", pos + 1, top);
  createSubTitle(doc, "Sucursal", pos + innerColsWidth[0], top);
  createSubTitle(doc, "Cliente", pos + innerColsWidth[1], top);
  createSubTitle(doc, "Monto\nPago", pos + innerColsWidth[2], top - 2);
  createSubTitle(doc, "Tipo\nPago", pos + innerColsWidth[3], top - 2);
  createSubTitle(doc, "Fecha", pos + innerColsWidth[4], top);
  // createSubTitle(doc, "Total\nTransferencia", pos + colsWidth[4], top - 2);
  // createSubTitle(doc, "Total\nDescuento", pos + colsWidth[5], top - 2);
  // createSubTitle(doc, "Total\nPagado", pos + colsWidth[6], top - 2);
  // createSubTitle(doc, "Fecha\nApertura", pos + colsWidth[7], top - 2);

  // pos += colsWidth[2];
  // createSubTitle(doc, "Créditos", pos, top, "center");
  // pos += colsWidth[3];
  // createSubTitle(doc, "Balance", pos, top, "center");
}

export { generateReport };
