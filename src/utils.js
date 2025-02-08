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

function getDateRangeFilter(field, fromDate, toDate, convertion) {
  if (convertion == undefined || convertion == null) convertion = true;
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
        condition = `AND ${field}${
          convertion == true ? "::date" : ""
        } BETWEEN '${fromDate}' AND '${toDate}'`;
      }
    }
  }

  return condition;
}

function getGenericLikeFilter(field, value, isFirst) {
  let prefix = "AND";
  if (isFirst && isFirst == true) {
    prefix = "where";
  }

  if (!value || value === "null" || value == "undefined") {
    return `${prefix} ${field} LIKE '%'`;
  }

  if (value?.split(",").length > 1) {
    console.log("VALUE %%%%%%%%%%%%", value);
    return `${prefix} ${field} IN (${value})`;
  } else {
    return `${prefix} ${field} LIKE '${value}'`;
  }
}

function getCurrentISODate() {
  return new Date().toISOString();
}

module.exports = {
  generateWhereStatement,
  getDateRangeFilter,
  getGenericLikeFilter,
  getCurrentISODate,
};
