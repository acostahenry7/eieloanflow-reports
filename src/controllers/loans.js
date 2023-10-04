const db = require("../models");
const { generateWhereStatement } = require("../utils");

const controller = {};

controller.getLoans = async (queryParams) => {
  console.log(queryParams);
  try {
    const [data, meta] =
      await db.query(`SELECT c.first_name || '' || c.last_name as customer_name, c.identification, l.loan_number_id, l.interest_rate_type, 
      l.amount_approved, l.number_of_installments, ir.percent, l.frequency_of_payment, lp.name, l.status_type,
      COALESCE(SUM(a.capital) filter(where a.paid = 'true'), 0)  as paid_capital,
      COALESCE(SUM(a.interest) filter(where a.paid = 'true'), 0)  as paid_interest,
      COALESCE(SUM(a.discount_interest), 0) discount_interest,
      COALESCE(SUM(a.discount_mora), 0) discount_mora,
      COALESCE(SUM(a.mora), 0) mora,
      COALESCE(SUM(a.total_paid_mora) filter(where a.paid = 'true'), 0) total_paid_mora,
      COALESCE(SUM(a.total_paid) filter(where a.paid = 'true'), 0)  as total_paid,
      COALESCE(SUM(a.amount_of_fee) filter(where a.status_type = 'DEFEATED'), 0)  as total_arrear,
      COALESCE(COUNT(a.amortization_id) filter(where a.paid = 'true'), 0) paid_dues,
      COALESCE(SUM(a.amount_of_fee), 0)  as total_amount,
      COALESCE(SUM(a.interest), 0)  as total_interest,
      l.amount_of_free as due_amount,
      COALESCE(SUM(a.amount_of_fee) - SUM(a.total_paid) filter(where a.paid = 'true'), 0) as pending_amount,
      COALESCE(SUM(a.capital) filter(where a.status_type = 'ACTIVE'), 0)  as pending_capital,
      COALESCE(SUM(a.interest) filter(where a.status_type = 'ACTIVE'), 0)  as pending_interest,
      COALESCE(SUM(a.mora) filter(where a.status_type = 'ACTIVE'), 0) pending_mora,
      COALESCE(SUM(a.mora) filter(where a.status_type = 'DEFEATED'), 0) arrear_mora,
      COALESCE(COUNT(a.amortization_id) filter(where a.paid = 'false'), 0) pending_dues,
      COALESCE(COUNT(a.amortization_id) filter(where a.status_type = 'DEFEATED'), 0) arrear_dues
      FROM public.loan l
      LEFT JOIN customer_loan cl ON (l.loan_id = cl.loan_id)
      JOIN customer c ON (cl.customer_id = c.customer_id)
      LEFT JOIN interest_rate ir ON (l.interest_rate_id = ir.interest_rate_id)
      LEFT JOIN late_payment lp ON (l.late_payment_id = lp.late_payment_id)
      RIGHT JOIN amortization a ON (a.loan_id = l.loan_id)
      GROUP BY  c.first_name, c.last_name , c.identification, l.loan_number_id, l.interest_rate_type, 
      l.amount_approved, l.number_of_installments, ir.percent, l.frequency_of_payment, lp.name, l.status_type,
      a.total_paid_mora, l.amount_of_free
      HAVING l.status_type not in ('DELETE', 'PAID')
        ${generateWhereStatement(queryParams)}`);

    if (data.length == 0) {
      return [];
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = controller;
