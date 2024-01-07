const db = require("../models");
const { generateWhereStatement, getDateRangeFilter } = require("../utils");
var _ = require("lodash");

const controller = {};

controller.getLoans = async (queryParams) => {
  try {
    const [data, meta] = await db.query(
      `SELECT distinct(l.loan_number_id), l.loan_id, c.first_name || ' ' || c.last_name as customer_name, c.identification,  l.interest_rate_type, 
      l.amount_approved, l.number_of_installments, l.frequency_of_payment, l.status_type, lp.name, l.status_type,
      l.loan_situation, la.loan_type, l.amount_of_free, o.name as outlet_name, l.total_amount
      FROM public.loan l
      LEFT JOIN loan_application la ON (l.loan_application_id = la.loan_application_id)
      LEFT JOIN customer c ON (la.customer_id = c.customer_id)
      LEFT JOIN late_payment lp ON (l.late_payment_id = lp.late_payment_id)
      LEFT JOIN outlet o ON (l.outlet_id = o.outlet_id)
      WHERE l.outlet_id like '${queryParams.outletId || ""}%'	
	  AND lower(c.first_name || ' ' || c.last_name) like '${
      queryParams.customerName || ""
    }%'
	  AND c.identification like '${queryParams.identification || ""}%'
	  AND l.loan_number_id::varchar like '${queryParams.loanNumber || ""}%'
	  AND l.status_type like '${queryParams.loanStatus || ""}%'
	  AND la.loan_type like '${queryParams.loanType || ""}%'
	  AND l.loan_situation like '${queryParams.loanSituation || ""}%'
    GROUP BY  c.first_name, c.last_name , c.identification, l.loan_number_id, l.interest_rate_type, 
l.amount_approved, l.number_of_installments,l.frequency_of_payment, lp.name, l.status_type,
l.amount_of_free, la.loan_type, l.loan_situation, l.outlet_id, loan_id,o.name, l.total_amount`
    );

    if (data.length == 0) {
      console.log(data);
      return [];
    }

    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

controller.getLoanDetails = async (req) => {
  try {
    const [data, meta] =
      await db.query(`SELECT distinct(l.loan_number_id), c.first_name || ' ' || c.last_name as customer_name, c.identification, l.interest_rate_type, 
    l.amount_approved, l.number_of_installments, lp.amount, l.frequency_of_payment,  lp.name, l.status_type,
    l.loan_situation, la.loan_type,
          COALESCE(SUM(a.capital) filter(where a.paid = 'true'),0)  paid_capital,
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
          l.amount_of_free,
          COALESCE(SUM(a.amount_of_fee) - SUM(a.total_paid) filter(where a.paid = 'false'), 0) as pending_amount,
          COALESCE(SUM(a.capital) filter(where a.paid = 'false'), 0)  as pending_capital,
          COALESCE(SUM(a.interest) filter(where a.paid = 'false'), 0)  as pending_interest,
          COALESCE(SUM(a.mora) filter(where a.paid = 'false'), 0) pending_mora,
          COALESCE(lc.amount,0) as charges,
          COALESCE(COUNT(a.amortization_id) filter(where a.paid = 'false'), 0) pending_dues,
          COALESCE(COUNT(a.amortization_id) filter(where a.status_type = 'DEFEATED'), 0) arrear_dues
          FROM amortization a
        RIGHT JOIN loan l ON (l.loan_id = a.loan_id)
        JOIN loan_application la ON (l.loan_application_id = la.loan_application_id)
        JOIN customer c ON (la.customer_id = c.customer_id)
        JOIN late_payment lp ON (l.late_payment_id = lp.late_payment_id)
        LEFT JOIN loan_charge lc ON (l.loan_id = lc.loan_id)
        WHERE a.loan_id = '${req.params.id}'
        GROUP BY  c.first_name, c.last_name , c.identification, l.loan_number_id, l.interest_rate_type, 
    l.amount_approved, l.number_of_installments,l.frequency_of_payment, lp.name, l.status_type,
    l.amount_of_free, la.loan_type, l.loan_situation, l.outlet_id, lp.amount, lc.amount`);

    if (data.length == 0) {
      console.log(data);
      return [];
    }

    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

controller.getLoanActivities = async (queryParams) => {
  console.log(queryParams);
  try {
    const [data, meta] =
      await db.query(`SELECT c.first_name || ' ' || c.last_name as customer_name, c.identification, l.loan_number_id, activity_loan_type as action_type,
      al.note as commentary, e.first_name || ' ' || e.last_name as employee_name, al.created_date
      FROM activity_loan al
      JOIN loan l ON (al.loan_id = l.loan_id)
      JOIN loan_application la ON (al.loan_application_id = la.loan_application_id)
      JOIN customer c ON (la.customer_id = c.customer_id)
      JOIN jhi_user u ON (al.created_by = c.created_by)
      JOIN employee e ON (u.employee_id = e.employee_id)
      WHERE l.status_type not in ('DELETE', 'PAID')  
        ${generateWhereStatement(queryParams)}
        ${
          queryParams.dateFrom
            ? getDateRangeFilter(
                "al.created_date",
                queryParams.dateFrom,
                queryParams.dateTo
              )
            : ""
        }`);

    if (data.length == 0) {
      console.log(data);
      return [];
    }

    console.log(data);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

controller.getLoanDiscounts = async (queryParams) => {
  console.log(queryParams);

  let query = `SELECT c.first_name || ' ' || c.last_name as customer_name, c.identification, l.loan_number_id, discount_type,
  a.quota_number, ad.description as commentary, e.first_name || ' ' || e.last_name as employee_name, ad.created_date, ad.status_type
  FROM amortization_discount ad
  LEFT JOIN amortization a ON (ad.amortization_id = a.amortization_id )
  LEFT JOIN loan l ON (a.loan_id = l.loan_id)
  JOIN loan_application la ON (l.loan_application_id = la.loan_application_id)
  JOIN customer c ON (la.customer_id = c.customer_id)
  JOIN jhi_user u ON (ad.created_by = u.login)
  JOIN employee e ON (u.employee_id = e.employee_id)
  ${generateWhereStatement(queryParams)}
  ${
    queryParams.dateFrom
      ? getDateRangeFilter(
          "ad.created_date",
          queryParams.dateFrom,
          queryParams.dateTo
        )
      : ""
  }`;

  if (queryParams.discountType == "GLOBAL") {
    query = `SELECT c.first_name || ' ' || c.last_name as customer_name, c.identification, l.loan_number_id, discount_type,
    ad.description as commentary, e.first_name || ' ' || e.last_name as employee_name, ad.created_date, ad.status_type
    FROM amortization_discount ad
    LEFT JOIN loan l ON (ad.loan_id = l.loan_id)
    JOIN loan_application la ON (l.loan_application_id = la.loan_application_id)
    JOIN customer c ON (la.customer_id = c.customer_id)
    JOIN jhi_user u ON (ad.created_by = u.login)
    JOIN employee e ON (u.employee_id = e.employee_id)
    ${generateWhereStatement(queryParams)}
    ${
      queryParams.dateFrom
        ? getDateRangeFilter(
            "ad.created_date",
            queryParams.dateFrom,
            queryParams.dateTo
          )
        : ""
    }`;
  }

  try {
    const [data, meta] = await db.query(query);

    if (data.length == 0) {
      // console.log(data);
      return [];
    }

    // console.log(data);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

controller.getRegisterClose = async (queryParams) => {
  console.log(queryParams);
  try {
    const [data, meta] =
      await db.query(`SELECT c.first_name || ' ' || c.last_name as customer_name, c.identification, l.loan_number_id, p.pay, 
      r.amount, p.register_id, r.total_cash, r.total_check, r.total_transfer, r.total_discount, r.total_pay, r.total_registered as difference, 
      e.first_name || ' ' || e.last_name as employee_name, r.created_date opening_date, r.last_modified_date, p.created_date, p.payment_type,
      case
	  	when r.total_registered  + 10 > r.total_pay - r.total_check then r.total_pay - r.total_registered - r.total_check
	  	else total_registered 
	  	end as  difference
      FROM payment p
      JOIN loan l ON (p.loan_id = l.loan_id)
      JOIN customer c ON (p.customer_id = c.customer_id)
      JOIN register r ON (p.register_id = r.register_id)
      JOIN jhi_user u ON (r.user_id = u.user_id)
      JOIN employee e ON (u.employee_id = e.employee_id)
      WHERE l.status_type NOT IN ('DELETE')
      AND p.outlet_id like '${queryParams.outletId || ""}%'
      ${
        queryParams.dateFrom && queryParams.dateTo
          ? `AND r.created_date::date between '${queryParams.dateFrom}' and '${queryParams.dateTo}'`
          : ""
      }
      ORDER BY r.created_date desc,  p.register_id`);

    if (data.length == 0) {
      console.log(data);
      return [];
    }

    // console.log("##################", _.groupBy(data, "register_id"));
    return _.groupBy(data, "register_id");
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

module.exports = controller;
