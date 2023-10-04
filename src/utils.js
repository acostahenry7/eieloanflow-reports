function generateWhereStatement(queryParams) {
  return `AND lower(c.first_name || c.last_name) like '%${
    queryParams.customerName?.toLowerCase() || ""
  }%'
      AND c.identification like '%${queryParams.indetification || ""}%'
      AND l.outlet_id like '%${queryParams.outletId || ""}%'
      ${
        queryParams.loanNumber
          ? `AND l.loan_number_id= '${queryParams.loanNumber}'`
          : ""
      }`;
}

module.exports = {
  generateWhereStatement,
};
