const db = require("../models");
const path = require("path");
const XlsxPopulate = require("xlsx-populate");
const { generateWhereStatement, getDateRangeFilter } = require("../utils");
var _ = require("lodash");
const { nanoid } = require("nanoid");

const controller = {};

controller.getLoanApplication = async (queryParams) => {
  try {
    const [loanApplication] = await db.query(`
    SELECT c.first_name || ' ' || c.last_name as customer_name, c.identification, c.birth_date, c.sex, c.nationality,
    c.phone, c.mobile, c_pv.name province, c_mn.name municipality, c_sct.name section, c.street, c.street2, c.year_living,
    c.month_living, la.loan_application_id, la.loan_type, la.created_date, la.requested_amount, la.loan_application_type, 
    o.name as outlet_name, la.by_office, la.reference, la.status_type, lwp.company_name as work_place_company, 
    tc.name as work_place_company_type, lwp.job_time as work_place_journey, lwp.year_job as work_place_years, 
    lwp.month_job as work_place_months, occ.name as ocupation, lwp.monthly_income, wp_pv.name work_place_province, 
    wp_mn.name work_place_municipality, wp_sct.name as work_place_section, lwp.work_place_street, lwp.work_place_street2, 
    lwp.work_place_phone, lwp.other_income work_place_other_income, lg.first_name || ' ' || lg.last_name as guarantor_name,
    vh.amount as vehicle_amount, vh.year as vehicle_year, vh.vehicle_type, vh.model as vehicle_model, vhb.name vehicle_brand
    FROM loan_application la
    LEFT JOIN loan l ON (la.loan_application_id = l.loan_application_id)
    LEFT JOIN loan_work_place lwp ON (l.loan_application_id = lwp.loan_work_place_id)
    LEFT JOIN type_company tc ON (lwp.type_company_id = tc.type_company_id)
    LEFT JOIN occupation occ ON (lwp.occupation_id = occ.occupation_id)
    LEFT JOIN province wp_pv ON (lwp.work_place_province_id = wp_pv.province_id)
    LEFT JOIN municipality wp_mn ON (lwp.work_place_municipality_id = wp_mn.municipality_id)
    LEFT JOIN section wp_sct ON (lwp.work_place_section_id = wp_sct.section_id)
    JOIN customer c ON (la.customer_id = c.customer_id)
    LEFT JOIN province c_pv ON (c.province_id  = c_pv.province_id)
    LEFT JOIN municipality c_mn ON (c.municipality_id  = c_mn.municipality_id)
    LEFT JOIN section c_sct ON (c.section_id = c_sct.section_id)
    LEFT JOIN loan_guarantor lg ON (la.loan_application_id = lg.loan_guarantor_id)
    LEFT JOIN loan_vehicle vh ON (la.loan_application_id = vh.loan_vehicle_id)
    LEFT JOIN vehicle_brand vhb ON (vh.vehicle_brand_id = vhb.vehicle_brand_id)
    JOIN outlet o On (la.outlet_id = o.outlet_id)
      AND la.outlet_id LIKE '${queryParams.outletId || "%"}'
      AND la.created_date BETWEEN '${queryParams.dateFrom}' AND '${
      queryParams.dateTo
    }'
      AND la.status_type LIKE '${queryParams.status || "%"}'
      AND la.loan_type LIKE '${queryParams.loanType || "%"}'`);

    return loanApplication;
  } catch (error) {
    console.log(error);
  }
};

controller.getLoans = async (queryParams) => {
  try {
    const [data, meta] = await db.query(
      `SELECT distinct(l.loan_number_id), l.loan_id, c.first_name || ' ' || c.last_name as customer_name, c.identification,  l.interest_rate_type, 
      l.amount_approved, l.number_of_installments, l.frequency_of_payment, l.status_type, lp.name, l.status_type,
      l.loan_situation, la.loan_type, l.amount_of_free, o.name as outlet_name, l.total_amount, l.created_date
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
    AND l.created_date::date BETWEEN '${queryParams.dateFrom}' AND '${
        queryParams.dateTo
      }'
    AND l.status_type NOT LIKE 'DELETE'
    GROUP BY  c.first_name, c.last_name , c.identification, l.loan_number_id, l.interest_rate_type, 
    l.amount_approved, l.number_of_installments,l.frequency_of_payment, lp.name, l.status_type,
    l.amount_of_free, la.loan_type, l.loan_situation, l.outlet_id, loan_id,o.name, l.total_amount, l.created_date
    ORDER BY l.created_date DESC`
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
      await db.query(` SELECT distinct(l.loan_number_id), min(a.payment_date) as creation_date, c.first_name || ' ' || c.last_name as customer_name, c.identification, l.interest_rate_type, 
      l.amount_approved, count(a.amortization_id) as number_of_installments, lp.amount, l.frequency_of_payment,  lp.name, l.status_type,
      l.loan_situation, la.loan_type,l.created_date,
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
        case 
        when l.frequency_of_payment = 'DAILY' THEN ((sum(a.amount_of_fee)/l.amount_approved) ^ (1/(count(a.amortization_id)/30::float)::float) - 1)*100  
        when l.frequency_of_payment = 'INTER_DAY'THEN ((sum(a.amount_of_fee)/l.amount_approved) ^ (1/(count(a.amortization_id)/15)::float) - 1)*100  
        when l.frequency_of_payment = 'WEEKLY' THEN ((sum(a.amount_of_fee)/l.amount_approved) ^ (1/(count(a.amortization_id)/4)::float) - 1)*100  
        when l.frequency_of_payment = 'BIWEEKLY' THEN ((sum(a.amount_of_fee)/l.amount_approved) ^ (1/(count(a.amortization_id)/2)::float) - 1)*100  
        when l.frequency_of_payment = 'MONTHLY' THEN ((sum(a.amount_of_fee)/l.amount_approved) ^ (1/count(a.amortization_id)::float) - 1)*100  
        end as intrest_percent,
        COALESCE(SUM(a.interest), 0)  as total_interest,
            max(a.amount_of_fee) as amount_of_free,
            COALESCE(SUM(a.amount_of_fee) - SUM(a.total_paid) filter(where a.paid = 'false'), 0) as pending_amount,
            COALESCE(SUM(a.capital) filter(where a.paid = 'false'), 0)  as pending_capital,
            COALESCE(SUM(a.interest) filter(where a.paid = 'false'), 0)  as pending_interest,
            COALESCE(SUM(a.mora) filter(where a.paid = 'false'), 0) pending_mora,
            COALESCE(SUM(lc.amount),0) as charges,
            COALESCE(COUNT(a.amortization_id) filter(where a.paid = 'false'), 0) pending_dues,
            COALESCE(COUNT(a.amortization_id) filter(where a.status_type = 'DEFEATED'), 0) arrear_dues
            FROM amortization a
          RIGHT JOIN loan l ON (l.loan_id = a.loan_id)
          JOIN loan_application la ON (l.loan_application_id = la.loan_application_id)
          JOIN customer c ON (la.customer_id = c.customer_id)
          JOIN late_payment lp ON (l.late_payment_id = lp.late_payment_id)
          LEFT JOIN loan_charge lc ON (l.loan_id = lc.loan_id)
      LEFT JOIN interest_rate ir ON (l.interest_rate_id = ir.interest_rate_id)
          WHERE a.loan_id = '${req.params.id}'
      AND a.status_type NOT LIKE 'DELETE'
          GROUP BY  c.first_name, c.last_name , c.identification, l.loan_number_id, l.interest_rate_type, 
      l.amount_approved,l.frequency_of_payment, lp.name, l.status_type, l.created_date,
      la.loan_type, l.loan_situation, l.outlet_id, lp.amount,ir.percent
      ORDER BY l.created_date DESC`);

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
  //${generateWhereStatement(queryParams)}
  try {
    const [data, meta] =
      await db.query(`SELECT c.first_name || ' ' || c.last_name as customer_name, c.identification, l.loan_number_id, activity_loan_type as action_type,
      al.note as commentary, e.first_name || ' ' || e.last_name as employee_name, al.created_date
      FROM activity_loan al
      JOIN loan l ON (al.loan_id = l.loan_id)
      JOIN loan_application la ON (al.loan_application_id = la.loan_application_id)
      JOIN customer c ON (la.customer_id = c.customer_id)
      JOIN jhi_user u ON (al.created_by = u.login)
      JOIN employee e ON (u.employee_id = e.employee_id)
      WHERE l.status_type not in ('DELETE', 'PAID')  
        
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
      return [];
    }

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
      await db.query(`SELECT c.first_name || ' ' || c.last_name as customer_name, c.identification, l.loan_number_id, p.pay, o.name as outlet,
      r.amount, p.register_id, r.total_cash, r.total_check, r.total_transfer, r.total_discount, r.total_pay, r.total_registered as difference, 
      e.first_name || ' ' || e.last_name as employee_name, r.created_date opening_date, r.last_modified_date, p.created_date, p.payment_type,
      e.commission_debt_collector_percentage as collector_percentage, p.status_type,
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
      JOIN outlet o ON (l.outlet_id = o.outlet_id)
      --WHERE l.status_type NOT IN ('DELETE')
      WHERE p.status_type = 'ENABLED'
      AND r.outlet_id like '${queryParams.outletId || ""}%'
      ${
        queryParams.dateFrom && queryParams.dateTo
          ? `AND p.created_date::date between '${queryParams.dateFrom}' and '${queryParams.dateTo}'`
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

controller.getGroupedRegisterClose = async (queryParams) => {
  try {
    const [data, meta] = await db.query(`
      select e.first_name || ' ' || e.last_name as employee_name, 
      count(payment_id) as transactions,  sum(pay) filter(where p.status_type = 'ENABLED') pay,
      o.name as outlet
      from payment p
      left join register r on (p.register_id = r.register_id)
      left join jhi_user ju on (r.created_by = ju.login)
      left join employee e on (ju.employee_id = e.employee_id)
      left join outlet o on (r.outlet_id = o.outlet_id)
      where r.outlet_id like '${queryParams.outletId || ""}%'
      AND p.created_date::date between '${queryParams.dateFrom}' and '${
      queryParams.dateTo
    }'
      group by ju.login, e.first_name, e.last_name, o.name`);

    return data;
  } catch (error) {
    console.log(error);
  }
};

controller.getLoanMovement = async (queryParams) => {
  try {
    const [data, meta] = await db.query(`
    SELECT l.loan_number_id, la.loan_type, l.status_type, l.loan_situation,
    c.first_name || ' ' || c.last_name as customer_name, p.pay, p.created_date,
    string_agg(a.quota_number::varchar, ', ' order by a.quota_number) as quota_number,
    string_agg(a.status_type::varchar, ',' order by a.quota_number) as quota_status,p.payment_type,
    string_agg(pd.pay::varchar, ', ' order by a.quota_number) as quota_paid_amounts
    FROM payment p
    JOIN payment_detail pd ON (p.payment_id = pd.payment_id)
    LEFT JOIN loan l ON (p.loan_id = l.loan_id)
    LEFT JOIN loan_application la ON (l.loan_application_id = la.loan_application_id)
    LEFT JOIN customer c ON (la.customer_id = c.customer_id)
    INNER JOIN amortization a ON (pd.amortization_id = a.amortization_id AND a.status_type <> 'DELETE')
    WHERE l.status_type <> 'DELETE'
    AND p.outlet_id like '${queryParams.outletId || ""}%'
    AND p.created_date::date between '${queryParams.dateFrom}' and '${
      queryParams.dateTo
    }'
    GROUP BY l.loan_number_id, c.first_name, c.last_name, p.pay, p.created_date,
    la.loan_type, l.status_type, l.loan_situation, p.outlet_id, p.payment_type
    ORDER BY p.created_date
    `);
    return _.groupBy(data, "loan_number_id");
  } catch (error) {
    console.log(error);
  }
};

controller.getDatacreditLoans = async (queryParams) => {
  try {
    const [data, meta] =
      await db.query(`SELECT c.first_name || ' ' || c.last_name as customer_name, c.identification, c.street || ' ' || c.street2 as customer_address,
      c.phone, c.mobile, l.loan_number_id, l.created_date::date, l.amount_approved, l.amount_of_free, l.loan_situation, la.loan_type, l.status_type,
      l.amount_approved::int - sum(a.capital) filter(where a.paid = 'true') as current_balance,
      sum(a.capital) filter(where a.status_type ='DEFEATED') as arrear_balance,
      max(a.payment_date) filter(where a.paid='false') as expiration_date,
      max(a.payment_date) filter(where a.paid = 'true') as last_payment_date
      FROM loan l
      JOIN loan_application la ON (l.loan_application_id = la.loan_application_id)
      JOIN customer c ON (la.customer_id = c.customer_id)
      JOIN amortization a ON (l.loan_id = a.loan_id)
      WHERE a.payment_date::date BETWEEN '${queryParams.dateFrom}' AND '${
        queryParams.dateTo
      }'
      AND l.outlet_id like '${queryParams.outletId || "%"}'
      AND l.status_type like '${queryParams.loanStatus || ""}%'
	  AND la.loan_type like '${queryParams.loanType || ""}%'
	  AND l.loan_situation like '${queryParams.loanSituation || ""}%'
      GROUP BY c.first_name, c.last_name, c.identification, c.street, c.street2, l.status_type,
      c.phone, c.mobile, l.loan_number_id, l.created_date::date, l.amount_approved, l.amount_of_free, l.loan_situation, la.loan_type`);

    if (data.length == 0) {
      console.log(data);
      return [];
    }

    // console.log("##################", _.groupBy(data, "register_id"));
    return data;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

controller.generateDatacredit = async (req, res, queryParams) => {
  let alphabet = [];
  for (i = 0; i < 26; i++) {
    alphabet.push((i + 10).toString(36).toUpperCase());
  }

  console.log(queryParams);
  const [loans, meta] = await db.query(`
  SELECT c.first_name || ' ' || c.last_name as customer_name, c.identification, c.street || ' ' || c.street2 as customer_address,
c.phone, c.mobile, l.loan_number_id, l.created_date::date, l.amount_approved, l.amount_of_free, l.loan_situation, la.loan_type, l.status_type,
l.amount_approved::int - sum(a.capital) filter(where a.paid = 'true') as current_balance,
sum(a.capital) filter(where a.status_type ='DEFEATED') as arrear_balance,
max(a.payment_date) filter(where a.paid='false') as expiration_date,
max(a.payment_date) filter(where a.paid = 'true') as last_payment_date
FROM loan l
JOIN loan_application la ON (l.loan_application_id = la.loan_application_id)
JOIN customer c ON (la.customer_id = c.customer_id)
JOIN amortization a ON (l.loan_id = a.loan_id)
WHERE a.payment_date::date BETWEEN '${queryParams.dateFrom}' AND '${
    queryParams.dateTo
  }'
AND l.outlet_id like '${queryParams.outletId || "%"}'
AND l.status_type like '${queryParams.loanStatus || ""}%'
	  AND la.loan_type like '${queryParams.loanType || ""}%'
	  AND l.loan_situation like '${queryParams.loanSituation || ""}%'
GROUP BY c.first_name, c.last_name, c.identification, c.street, c.street2, l.status_type,
c.phone, c.mobile, l.loan_number_id, l.created_date::date, l.amount_approved, l.amount_of_free, l.loan_situation, la.loan_type`);

  let rowArr = [
    ...loans.map((l) => {
      return {
        customerName: l.customer_name,
        identification: l.identification?.split("-").join(""),
        address: l.customer_address,
        phone: l.phone,
        mobile: l.mobile,
        loanNumber: l.loan_number_id,
        createdDate: l.created_date,
        approvedAmount: l.amount_approved,
        amountOfFee: l.amount_of_free,
        status: getLoanSituation(l.loan_situation),
        currentBalance: l.current_balance,
        arrearBalance: l.arrear_balance,
        expirationDate: l.expiration_date?.toISOString().split("T")[0] || "",
        lastPaymentDate: l.last_payment_date?.toISOString().split("T")[0] || "",
        loanType: l.loan_type.toLowerCase().includes("pyme") ? "M" : "N",
      };
    }),
  ];

  let generatedId = nanoid();
  let filePath = path.join(__dirname, `../../client/public/reports`);
  let fileName = `datacredito-${generatedId}.xlsx`;

  return XlsxPopulate.fromFileAsync(
    path.join(__dirname, "../Formato-de-Envio-datacredito.xlsx")
  )
    .then(async (workbook) => {
      //Fill preconf-ingo
      // workbook
      //   .sheet("Herramienta Formato 607")
      //   .cell("C4")
      //   .value(`${outlet[0].rnc}`);
      // workbook
      //   .sheet("Herramienta Formato 607")
      //   .cell("C5")
      //   .value(`${queryParams.dateYear}${queryParams.dateMonth}`);
      // workbook
      //   .sheet("Herramienta Formato 607")
      //   .cell("C6")
      //   .value(`${rowArr.length}`);

      for (let row = 0; row < rowArr.length; row++) {
        let currentRow = Object.values(rowArr[row]);

        for (i = 0; i < currentRow.length; i++) {
          // console.log(`${alphabet[i + 1]}${12 + row}`);
          workbook
            .sheet("Data_Credito")
            .cell(`${alphabet[i]}${14 + row}`)
            .value(currentRow[i]);
        }
      }

      //console.log(`http://${req.headers.host}/static/reports/${fileName}`);

      // Write to file.
      await workbook.toFileAsync(`${filePath}/${fileName}`);
      console.log("SENDING RESPONSE TO CLIENT DATACREDITO");
      return `http://${req.headers.host}/static/reports/${fileName}`;
    })
    .catch((err) => {
      console.log(err);
      return;
    });
};

controller.getAmortizationTable = async (queryParams) => {
  try {
    if (!queryParams.loanNumber) {
      throw new Error("Se necesita número de présatmo");
    }

    let [amortizationTable] = await db.query(`
      SELECT l.loan_number_id, c.first_name || ' ' || c.last_name as customer_name, quota_number, payment_date, balance_of_capital, interest, 
      amount_of_fee, capital, mora, total_paid_mora,discount_mora, discount_interest, total_paid, 
      amount_of_fee + mora - (discount_interest+discount_mora) - total_paid as pending, a.status_type
      FROM amortization a
      JOIN loan l ON (a.loan_id = l.loan_id)
      JOIN loan_application la ON (l.loan_application_id = la.loan_application_id)
      JOIN customer c ON (la.customer_id = c.customer_id)
      WHERE a.outlet_id like '${queryParams.outletId || "%"}'
      AND a.status_type NOT LIKE 'DELETE'
      AND l.loan_id in (SELECT loan_id FROM loan WHERE loan_number_id = '${
        queryParams.loanNumber || "%"
      }')
      ORDER BY l.loan_number_id desc, quota_number
      `);
    console.log(amortizationTable);
    return amortizationTable;
  } catch (error) {
    console.log(error);
    if (error.message == "Se necesita número de présatmo") {
      return [];
    }
    throw error;
  }
};

function getLoanSituation(situation) {
  let result = "";
  switch (situation) {
    case "ARREARS":
      result = "A";
      break;
    case "NORMAL":
      result = "N";
      break;
    case "SEIZED":
      result = "C";
      break;
    default:
      break;
  }
  return result;
}

module.exports = controller;
