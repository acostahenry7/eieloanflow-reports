const db = require("../models");
const bcrypt = require("bcryptjs");

const controller = {};

controller.getArrearUsers = async () => {
  try {
    const [data, meta] =
      await db.query(`SELECT c.first_name, c.last_name, c.identification, l.loan_number_id, c.phone, l.created_date, l.amount_approved, l.amount_of_free, l.number_of_installments, 
      COUNT(a.amortization_id) filter (where a.status_type = 'PAID') as paid_cuotas,
      COUNT(a.amortization_id) filter (where a.status_type = 'DEFEATED') as arrears_cuotas,
      TRUNC(cast((COUNT(a.amortization_id) filter (where a.status_type = 'DEFEATED')) as DECIMAL)/l.number_of_installments, 2) * 100 as arrear_percentaje,
      MIN(a.payment_date) filter (where a.status_type = 'DEFEATED') as defeated_since,
      SUM(a.amount_of_fee) filter (where a.status_type = 'DEFEATED') as defeated_amount
      FROM customer_loan cl
      JOIN customer c ON (cl.customer_id = c.customer_id)
      JOIN loan l ON (cl.loan_id = l.loan_id)
      JOIN amortization a ON (a.loan_id = l.loan_id)
      group by c.first_name, c.last_name,  c.identification, c.phone, l.loan_number_id, l.created_date, l.amount_approved, l.amount_of_free, l.number_of_installments;`);

    if (data.length == 0) {
      throw new Error("No data found");
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = controller;
