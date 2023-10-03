const db = require("../models");

const controller = {};

controller.getArrearUsers = async (queryParams) => {
  console.log(queryParams);
  try {
    const [data, meta] =
      await db.query(`SELECT c.first_name || ' ' || c.last_name as customer_name, l.loan_situation, c.identification, l.loan_number_id, c.phone, l.created_date, l.amount_approved, l.amount_of_free, l.number_of_installments, 
      COUNT(a.amortization_id) filter (where a.status_type = 'PAID') as paid_dues,
      COUNT(a.amortization_id) filter (where a.status_type = 'DEFEATED') as arrears_dues,
      TRUNC(cast((COUNT(a.amortization_id) filter (where a.status_type = 'DEFEATED')) as DECIMAL)/l.number_of_installments, 2) * 100 as arrear_percentaje,
      MIN(a.payment_date) filter (where a.status_type = 'DEFEATED') as defeated_since,
      SUM(a.amount_of_fee) filter (where a.status_type = 'DEFEATED') as defeated_amount
      FROM customer_loan cl
      JOIN customer c ON (cl.customer_id = c.customer_id)
      JOIN loan l ON (cl.loan_id = l.loan_id)
      JOIN amortization a ON (a.loan_id = l.loan_id)
      group by c.first_name, c.last_name, l.status_type,  c.identification, c.phone, l.loan_number_id, l.loan_situation, l.created_date, l.amount_approved, l.amount_of_free, l.number_of_installments, l.outlet_id
      having l.loan_situation like 'ARREARS'
      AND l.status_type not in ('DELETED', 'PAID')
      AND lower(c.first_name || c.last_name) like '%${
        queryParams.customerName || ""
      }%'
      AND c.identification like '%${queryParams.indetification || ""}%'
      AND l.outlet_id like '%${queryParams.outletId || ""}%'
      ${
        queryParams.loanNumber
          ? `AND l.loan_number_id= '${queryParams.loanNumber}'`
          : ""
      }`);

    if (data.length == 0) {
      return [];
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = controller;
