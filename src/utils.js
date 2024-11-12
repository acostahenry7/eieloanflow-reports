function generateWhereStatement(queryParams, whereClause) {
  let whereString = `${
    whereClause == true ? "WHERE" : "AND"
  } lower(c.first_name || c.last_name) like '%${
    queryParams.customerName?.toLowerCase() || ""
  }%'
      AND c.identification like '%${queryParams.indetification || ""}%'
      AND l.outlet_id like '%${queryParams.outletId || ""}%'
      ${
        queryParams.loanNumber
          ? `AND l.loan_number_id= '${queryParams.loanNumber}'`
          : ""
      }
      ${
        queryParams.actionType
          ? `AND activity_loan_type= '${queryParams.actionType}'`
          : ""
      }
      ${
        queryParams.discountType && queryParams.discountType != "GLOBAL"
          ? `AND discount_type= '${queryParams.discountType}'`
          : ""
      }
      `;

  return whereString;
}

function getDateRangeFilter(field, fromDate, toDate) {
  let condition = "";

  fromDate == "undefined" ? (fromDate = undefined) : fromDate;
  toDate == "undefined" ? (toDate = undefined) : toDate;

  if (!fromDate && !toDate) {
    condition = "";
  } else {
    if (!fromDate) {
      condition = `AND ${field} <= '${toDate}'`;
    } else {
      if (!toDate) {
        condition = `AND ${field} >= '${fromDate}'`;
      } else {
        condition = `AND ${field}::date BETWEEN '${fromDate}' AND '${toDate}'`;
      }
    }
  }

  return condition;
}

function getOutletFilter(field, value) {
  if (!value || value === "null" || value == "undefined") {
    return `AND ${field} LIKE '%'`;
  }

  console.log(value?.split(","));

  if (value?.split(",").length > 1) {
    console.log("VALUE %%%%%%%%%%%%", value);
    return `AND ${field} IN (${value})`;
  } else {
    return `AND ${field} LIKE '${value}'`;
  }
}

module.exports = {
  generateWhereStatement,
  getDateRangeFilter,
  getOutletFilter,
};
