const db = require("../models");
const { generateWhereStatement, getGenericLikeFilter } = require("../utils");
const _ = require("lodash");

const controller = {};

controller.customerLoans = async (queryParams) => {
  console.log(queryParams);
  try {
    const [data, meta] =
      await db.query(`select first_name || ' ' || last_name as customer_name, identification, loan_number_id,
      c.status_type, l.status_type as loan_status, la.loan_type
      from loan l
      join loan_application la on (l.loan_application_id = la.loan_application_id)
      join customer c on (la.customer_id = c.customer_id)
      where l.status_type not in ('DELETE')
      ${getGenericLikeFilter("l.status_type", queryParams.outletId)}
      --where l.outlet_id like '${queryParams.outletId || ""}%'
      
      and l.status_type like '${queryParams.loanStatus || ""}%'
      and c.status_type like '${queryParams.customerStatus || ""}%'
      and la.loan_type like '${queryParams.loanType || ""}%'
      order by first_name`);

    if (data.length == 0) {
      return [];
    }
    return data;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

controller.getArrearUsers = async (queryParams) => {
  console.log(queryParams);
  try {
    const [data, meta] =
      await db.query(`SELECT string_agg(distinct(z.name), ',') as zone, string_agg(distinct(z.zone_id), ',') as zone_id, 
      c.first_name || ' ' || c.last_name as customer_name, c.identification, l.loan_number_id, l.loan_situation, 
      c.phone, l.created_date, l.amount_approved, l.amount_of_free,l.frequency_of_payment,
      COUNT(distinct(a.amortization_id)) filter (where a.status_type <> 'DELETE') number_of_installments, 
      COUNT(distinct(a.amortization_id)) filter (where a.status_type = 'PAID') as paid_dues,
      COUNT(distinct(a.amortization_id)) filter (where a.status_type = 'DEFEATED') as arrears_dues,
      TRUNC(cast((COUNT(distinct(a.amortization_id)) filter (where a.status_type = 'DEFEATED')) as DECIMAL)/
      COUNT(distinct(a.amortization_id)) filter (where a.status_type <> 'DELETE'), 2) * 100 as arrear_percentaje,
      MIN(a.payment_date) filter (where a.status_type = 'DEFEATED') defeated_since,
      TRUNC(SUM( a.amount_of_fee + a.mora - a.discount - a.total_paid) filter (where a.status_type = 'DEFEATED')/ count(distinct(l.loan_number_id)) ,2) defeated_amount
      FROM customer_loan cl
      JOIN customer c ON (cl.customer_id = c.customer_id)
      JOIN loan l ON (cl.loan_id = l.loan_id)
      JOIN amortization a ON (a.loan_id = l.loan_id )
      JOIN loan_payment_address lpa ON (l.loan_payment_address_id = lpa.loan_payment_address_id)
      JOIN zone_neighbor_hood znh ON (lpa.section_id = znh.section_id)
      LEFT JOIN zone z ON (znh.zone_id = z.zone_id and z.outlet_id = l.outlet_id)
      group by c.first_name, c.last_name,  c.identification, c.phone, l.loan_number_id, l.created_date, l.amount_approved, 
      l.amount_of_free, l.number_of_installments, l.loan_situation, l.status_type, l.frequency_of_payment, l.outlet_id,
      z.status_type
      HAVING l.status_type not in ('DELETE', 'PAID', 'TRANSFERRED')
      AND COUNT(a.amortization_id) filter (where a.status_type = 'DEFEATED') > 0
      AND z.status_type = 'ENABLED'
      ${
        parseInt(queryParams.arrearFees) > 0
          ? `AND count(distinct(a.amortization_id)) filter(where a.status_type = 'DEFEATED') = ${queryParams.arrearFees}`
          : ""
      }
      AND l.outlet_id like '${queryParams.outletId || ""}%'
      ${
        queryParams.dateFrom && !queryParams.dateTo
          ? `AND l.created_date >= '${queryParams.dateFrom || ""}'`
          : ""
      } 

      ${
        queryParams.dateTo && !queryParams.dateFrom
          ? `AND l.created_date <= '${queryParams.dateTo || ""}'`
          : ""
      } 

      ${
        queryParams.dateFrom && queryParams.dateTo
          ? `AND l.created_date between '${queryParams.dateFrom}' and '${queryParams.dateTo}'`
          : ""
      } 


      ${
        queryParams.paymentDateFrom && !queryParams.paymentDateTo
          ? `AND a.payment_date >= '${queryParams.paymentDateFrom || ""}'`
          : ""
      } 

      ${
        queryParams.paymentDateToo && !queryParams.paymentDateFrom
          ? `AND a.payment_date <= '${queryParams.paymentDateTo || ""}'`
          : ""
      } 

      ${
        queryParams.paymentDateFrom && queryParams.paymentDateTo
          ? `AND a.payment_date between '${queryParams.paymentDateFrom}' and '${queryParams.paymentDateTo}'`
          : ""
      } 
      AND l.frequency_of_payment like '${queryParams.paymentFrequency || ""}%'

      ${
        !queryParams.zoneName
          ? ``
          : `AND string_agg(distinct(z.name), ',') like '%${
              queryParams.zoneName || ""
            }%'`
      }`);

    `SELECT t1.customer_name, loan_situation, identification, loan_number_id, phone, created_date, amount_approved, amount_of_free, 
      number_of_installments, frequency_of_payment,paid_dues, arrears_dues, defeated_since,	   
	  (select sum(pending)
	   from 
	   (select amount_of_fee + mora - discount - total_paid as pending
	   from amortization 
	   where loan_id = (select loan_id from loan where loan_number_id = t1.loan_number_id)
	   and status_type='DEFEATED'
	   limit t1.arrears_dues
	  )t0) as defeated_amount
FROM
(SELECT c.first_name || ' ' || c.last_name as customer_name, l.loan_situation, c.identification, l.loan_number_id, c.phone, l.created_date, l.amount_approved, l.amount_of_free, 
      l.number_of_installments, l.frequency_of_payment,
	  --max(z.name) as zone, max(z.zone_id) as zone_id,
      COUNT(distinct(a.amortization_id)) filter (where a.status_type = 'PAID') as paid_dues,
      COUNT(distinct(a.amortization_id)) filter (where a.status_type = 'DEFEATED') as arrears_dues,
      TRUNC(cast((COUNT(distinct(a.amortization_id)) filter (where a.status_type = 'DEFEATED')) as DECIMAL)/l.number_of_installments::integer, 2) * 100 as arrear_percentaje,
      MIN(a.payment_date) filter (where a.status_type = 'DEFEATED') as defeated_since
      FROM customer_loan cl
      JOIN customer c ON (cl.customer_id = c.customer_id)
      JOIN loan l ON (cl.loan_id = l.loan_id)
      JOIN loan_payment_address lpa ON (l.loan_payment_address_id = lpa.loan_payment_address_id)
      JOIN zone_neighbor_hood znh ON (lpa.section_id = znh.section_id)
      JOIN zone z ON (znh.zone_id = z.zone_id)
      JOIN amortization a ON (a.loan_id = l.loan_id and a.payment_date between '${
        queryParams.paymentDateFrom
      }' and '${queryParams.paymentDateTo}' )
      group by c.first_name, c.last_name, l.status_type,  c.identification, c.phone, l.loan_number_id, l.loan_situation, 
      l.created_date, l.amount_approved, l.amount_of_free, l.number_of_installments, l.outlet_id, l.frequency_of_payment
      having l.loan_situation like 'ARREARS'
      AND l.status_type not in ('DELETE', 'PAID')
      AND COUNT(a.amortization_id) filter (where a.status_type = 'DEFEATED') > 0
      AND lower(c.first_name || ' ' || c.last_name) like '${
        queryParams.customerName || ""
      }%'
      AND c.identification like '${queryParams.identification || ""}%'
      ${
        queryParams.loanNumber
          ? `AND l.loan_number_id::varchar like '${
              queryParams.loanNumber || ""
            }'`
          : ""
      } 
      ${
        parseInt(queryParams.arrearFees) > 0
          ? `AND count(a.quota_number) filter(where a.status_type = 'DEFEATED') = ${queryParams.arrearFees}`
          : ""
      }
      AND l.outlet_id like '${queryParams.outletId || ""}%'
      AND l.created_date between '${queryParams.dateFrom}' and '${
      queryParams.dateTo
    }'
      AND l.frequency_of_payment like '${queryParams.paymentFrequency || ""}%'
      ) T1`;

    if (data.length == 0) {
      return [];
    }
    return [...data];
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

controller.getCustomerAccountStatus = async (queryParams) => {
  console.log(queryParams);

  if (!queryParams.identification && !queryParams.loanNumber) {
    throw new Error("invalid_searchKey");
  } else {
    let loans;
    if (!queryParams.loanNumber) {
      [loans] = await db.query(
        `select loan_number_id from loan  l
        join loan_application la on l.loan_application_id = la.loan_application_id
        where la.customer_id = (select customer_id from customer where identification = '${
          queryParams.identification
        }')
        ${getGenericLikeFilter("l.outlet_id", queryParams.outletId)}
        AND l.status_type <> 'DELETE'
        `
      );
      loans = loans.map(({ loan_number_id }) => loan_number_id).join(",");
      console.log("LOANS", loans);
    } else {
      loans = queryParams.loanNumber;
    }

    try {
      const [data, meta] = await db.query(`
      SELECT l.loan_number_id, la.loan_type, l.status_type, l.loan_situation,
      c.first_name || ' ' || c.last_name as customer_name,c.identification, p.pay, 
      p.created_date, p.status_type as payment_status,
      string_agg(a.quota_number::varchar, ', ' order by a.quota_number) as quota_number,
      string_agg(a.status_type::varchar, ',' order by a.quota_number) as quota_status,p.payment_type,
      string_agg(pd.pay::varchar, ', ' order by a.quota_number) as quota_paid_amounts,
      t1.balance  as balance
      FROM payment p
      JOIN payment_detail pd ON (p.payment_id = pd.payment_id)
      LEFT JOIN loan l ON (p.loan_id = l.loan_id)
      LEFT JOIN loan_application la ON (l.loan_application_id = la.loan_application_id)
      LEFT JOIN customer c ON (la.customer_id = c.customer_id)
      INNER JOIN amortization a ON (pd.amortization_id = a.amortization_id AND a.status_type <> 'DELETE')
      LEFT JOIN (select a.loan_id, sum(a.amount_of_fee + a.mora + a.total_paid_mora) filter(where status_type <> 'DELETE') AS balance
        from amortization a
        where loan_id in (select loan_id from loan where loan_number_id in (${loans}))
        group by a.loan_id) t1 on (l.loan_id = t1.loan_id)
      WHERE l.status_type <> 'DELETE'
      --AND p.outlet_id like '${queryParams.outletId || ""}%'
      ${
        queryParams.loanNumber
          ? getGenericLikeFilter("l.loan_number_id::varchar", loans)
          : ""
      }
      ${getGenericLikeFilter("c.identification", queryParams.identification)}
      ${getGenericLikeFilter("l.outlet_id", queryParams.outletId)}
      ${getGenericLikeFilter("l.status_type", queryParams.loanStatus)}
      AND p.status_type <> 'CANCEL'
      GROUP BY l.loan_number_id, c.first_name, c.identification, c.last_name, p.pay, p.created_date,
      la.loan_type, l.status_type, l.loan_situation, p.outlet_id, p.payment_type, p.status_type,t1.balance
      ORDER BY p.created_date
      `);
      return _.groupBy(data, "loan_number_id");
    } catch (error) {
      console.log(error);
    }
  }

  // ${getDateRangeFilter(
  //   "p.created_date",
  //   queryParams.dateFrom,
  //   queryParams.dateTo,
  //   true
  // )}
};

module.exports = controller;

// AND a.payment_date between '${
//   queryParams.paymentDateFrom
// }' and '${queryParams.paymentDateTo}')
