const db = require("../models");
const { v4: uuid } = require("uuid");
const {
  generateWhereStatement,
  getDateRangeFilter,
  getGenericLikeFilter,
  getCurrentISODate,
} = require("../utils");
const path = require("path");
const XlsxPopulate = require("xlsx-populate");
const { nanoid } = require("nanoid");
const fs = require("fs");
var _ = require("lodash");
const { processTransactionsFormat } = require("../helpers/banks");
const conciliarTransacciones = require("../helpers/conciliationProcess");

const controller = {};

controller.accountCatalog = async (queryParams) => {
  console.log(queryParams);

  try {
    const [data, meta] = await db.query(
      `select number, name
      from account_catalog
      where outlet_id like'${queryParams.outletId || "%"}'
      order by number`
    );

    return data;
  } catch (err) {
    console.log(err);
  }
};

controller.getBankAccounts = async (queryParams) => {
  try {
    const [data, meta] = await db.query(
      `select * from bank_account
      where outlet_id like'${queryParams.outletId || "%"}'
      and bank_id like '${queryParams.bankId || "%"}'
      order by name`
    );

    return data;
  } catch (err) {
    console.log(err);
  }
};

controller.getBanks = async (queryParams) => {
  try {
    const [data, meta] = await db.query(
      `select * from bank
      where record_type = 'SYSTEM'
      order by name`
    );

    return data;
  } catch (err) {
    console.log(err);
  }
};

controller.getGeneralBalance = async (queryParams) => {
  let data = {};
  console.log(queryParams);

  let lastMonth =
    queryParams.date?.split("-")[1] == "01"
      ? "12"
      : (parseInt(queryParams.date?.split("-")[1]) - 1).toString();
  let lastYear =
    queryParams.date?.split("-")[1] == "01"
      ? (parseInt(queryParams.date?.split("-")[0]) - 1).toString()
      : queryParams.date?.split("-")[0];

  let queryPrevious = `AND (
        ber.target_date >= '${queryParams.prevDate}' 
        OR cp.check_payment_date >= '${queryParams.prevDate}'
        OR (
          (ber.target_date IS NULL AND cp.check_payment_date IS NULL)
          AND general_diary_date >= '${queryParams.prevDate}'
          )
        )`;

  try {
    const [generalBalance, meta] =
      await db.query(`select ac.account_catalog_id, ac.number, ac.name, ac.description, ac.control_account,
      ac.is_control, ac.status_type, ac.created_by, ac.created_date, ac.last_modified_by, ac.last_modified_date,
      coalesce(t1.debit,0) debit, coalesce(t1.credit, 0)credit,  coalesce(t1.balance,0) balance
      from account_catalog ac
      left join (select ac.account_catalog_id, ac.name,
      coalesce(sum(gda.debit),0) debit,
      coalesce(sum(gda.credit),0) credit,
      case 
	     when ac.number like any(array['1%', '6%']) then coalesce(sum(gda.debit) - sum(gda.credit),0)
      when ac.number like any(array['2%', '3%', '4%']) then coalesce(sum(gda.credit) - sum(gda.debit),0)
      end as balance
      from account_catalog ac
      left join general_diary_account gda on (ac.account_catalog_id = gda.account_catalog_id)
      left join general_diary gd on (gda.general_diary_id = gd.general_diary_id)
      ${getGenericLikeFilter("ac.outlet_id", queryParams.outletId, true)}
      and gda.status_type = 'ENABLED'
      and gd.general_diary_id in (
        select gd.general_diary_id 
        from general_diary gd
        left join bank_entry_retirement ber ON (gd.general_diary_id = ber.general_diary_id)
            left join check_payment cp on (gd.general_diary_id = cp.general_diary_id) 
        where gd.status_type = 'ENABLED'
          AND (
          ber.target_date <= '${queryParams.date}' 
          OR cp.check_payment_date <= '${queryParams.date}'
          OR (
            (ber.target_date IS NULL AND cp.check_payment_date IS NULL)
            AND general_diary_date <= '${queryParams.date}'
            )
          )
          ${
            queryParams.prevDate && queryParams.prevDate != "undefined"
              ? queryPrevious
              : ""
          }
          AND gd.created_by not in ('y.aragonez')  
      )
      group by ac.account_catalog_id, ac.name
      --having min(gd.general_diary_date) <= '${queryParams.date}'
      ) t1 on (ac.account_catalog_id = t1.account_catalog_id)
      ${getGenericLikeFilter("ac.outlet_id", queryParams.outletId, true)}
      order by ac.number`);

    if (data.length == 0) {
      return [];
    }

    let originalData = generalBalance;

    //   if (item.control_account === null && item.is_control === true) {
    //     accounts.push({
    //       ...item,
    //       controlledAccounts: [
    //         ...generalBalance
    //           .filter((item2) => {
    //             return item2.control_account === item.account_catalog_id;
    //           })
    //           .map((item3) => {
    //             return {
    //               ...item3,
    //               controlledAccounts: [
    //                 ...generalBalance
    //                   .filter(
    //                     (item4) =>
    //                       item4.control_account == item3.account_catalog_id
    //                   )
    //                   .map((item5) => {
    //                     return {
    //                       ...item5,
    //                       controlledAccounts: [
    //                         ...generalBalance
    //                           .filter(
    //                             (item6) =>
    //                               item6.control_account ==
    //                               item5.account_catalog_id
    //                           )
    //                           .map((item7) => {
    //                             return {
    //                               ...item7,
    //                               controlledAccounts: [
    //                                 ...generalBalance
    //                                   .filter(
    //                                     (item8) =>
    //                                       item8.control_account ==
    //                                       item7.account_catalog_id
    //                                   )
    //                                   .map((item9) => {
    //                                     return {
    //                                       ...item9,
    //                                       controlledAccounts: [
    //                                         ...generalBalance.filter(
    //                                           (item10) =>
    //                                             item10.control_account ==
    //                                             item9.account_catalog_id
    //                                         ),
    //                                       ],
    //                                     };
    //                                   }),
    //                                 ,
    //                               ],
    //                             };
    //                           }),
    //                       ],
    //                     };
    //                   }),
    //               ],
    //             };
    //           }),
    //       ],
    //     });
    //   }
    // });

    //data = accounts;

    let mainAccounts = getMainAccountsArr(generalBalance);
    //let accounts = getAccountsArr(generalBalance, mainAccounts);
    //let nestedAccounts = buildAccountTree(originalData);
    const { tree: accounts, accountMap } = buildAccountTree(originalData);
    //let accountBalances = [];

    accounts.forEach((account) => calculateBalance(account));
    const accountBalances = originalData.map((account) => ({
      ...account,
      balance: accountMap.get(account.account_catalog_id).totalBalance,
    }));

    // for (item of nestedAccounts) {
    //   let balance = 0;
    //   let prevBalance = 0;
    //   let isParent =
    //     originalData.filter(
    //       (sItem) => sItem.control_account == item.account_catalog_id
    //     ).length > 0;

    //   //if (isParent) balance = parseFloat(item.balance);
    //   // if (isParent) prevBalance = parseFloat(item.prev_balance);

    //   accountBalances.push({
    //     account_catalog_id: item.account_catalog_id,
    //     number: item.number,
    //     name: item.name,
    //     is_control: item.is_control,
    //     control_account: item.control_account,
    //     balance: getAccountBalance(item).toFixed(2),
    //     //prevBalance: getPrevAccountBalance(originalData, item, prevBalance),
    //   });
    // }

    //console.log(accountBalances);

    return { accounts, accountBalances, dashBalances: generalBalance };
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

controller.getValidationBalance = async (queryParams) => {
  let data = {};

  console.log(queryParams);

  try {
    const [data, meta] = await db.query(`SELECT 
    ac.account_catalog_id,
    ac.number,
    ac.name,
    ac.description,
    ac.control_account,
    ac.is_control,
    ac.status_type,
    ac.created_by,
    ac.created_date,
    ac.last_modified_by,
    ac.last_modified_date,
	COALESCE(t2.debit, 0) AS prev_debit,
	COALESCE(t2.credit, 0) AS prev_credit,
	COALESCE(t2.balance, 0) AS prev_balance,
    COALESCE(t1.debit, 0) AS mov_debit,
    COALESCE(t1.credit, 0) AS mov_credit,
    COALESCE(t1.balance, 0) AS mov_balance,
	case 
		when (COALESCE(t2.debit, 0) + COALESCE(t1.debit, 0)) > (COALESCE(t2.credit, 0) + COALESCE(t1.credit, 0)) 
		then (COALESCE(t2.debit, 0) + COALESCE(t1.debit, 0)) - (COALESCE(t2.credit, 0) + COALESCE(t1.credit, 0))
		else 0.00
	end total_debit,
	case 
		when (COALESCE(t2.credit, 0) + COALESCE(t1.credit, 0)) > (COALESCE(t2.debit, 0) + COALESCE(t1.debit, 0)) 
		then (COALESCE(t2.credit, 0) + COALESCE(t1.credit, 0)) - (COALESCE(t2.debit, 0) + COALESCE(t1.debit, 0))
		else 0.00
	end total_credit
FROM account_catalog ac
LEFT JOIN (
    -- Subquery 1: Balance calculation for a specific month (given date)
    SELECT 
        ac.account_catalog_id, 
        ac.name,
        COALESCE(SUM(gda.debit), 0) AS debit,
        COALESCE(SUM(gda.credit), 0) AS credit,
        CASE
            WHEN ac.number LIKE ANY(ARRAY['1%', '6%']) THEN COALESCE(SUM(gda.debit) - SUM(gda.credit), 0)
            WHEN ac.number LIKE ANY(ARRAY['2%', '3%', '4%']) THEN COALESCE(SUM(gda.credit) - SUM(gda.debit), 0)
        END AS balance
    FROM account_catalog ac
    LEFT JOIN general_diary_account gda ON (ac.account_catalog_id = gda.account_catalog_id)
    LEFT JOIN general_diary gd ON (gda.general_diary_id = gd.general_diary_id)
    --WHERE ac.outlet_id LIKE '${queryParams.outletId}'
    ${getGenericLikeFilter("ac.outlet_id", queryParams.outletId, true)}
        AND gda.status_type = 'ENABLED'
        AND gd.general_diary_id IN (
            SELECT gd.general_diary_id
            FROM general_diary gd
            LEFT JOIN bank_entry_retirement ber ON (gd.general_diary_id = ber.general_diary_id)
            LEFT JOIN check_payment cp ON (gd.general_diary_id = cp.general_diary_id)
            WHERE gd.status_type = 'ENABLED'
            
            AND (
                (ber.target_date >= date_trunc('month', '${
                  queryParams.date
                }'::date) and ber.target_date <=  '${queryParams.date}')
                OR (cp.check_payment_date >= date_trunc('month', '${
                  queryParams.date
                }'::date) and cp.check_payment_date <= '${queryParams.date}')
                OR (
                    (ber.target_date IS NULL AND cp.check_payment_date IS NULL)
                    AND(general_diary_date >= date_trunc('month', '${
                      queryParams.date
                    }'::date) and general_diary_date <= '${queryParams.date}')
                )
            )
            AND gd.created_by NOT IN ('y.aragonez')
        )
    GROUP BY ac.account_catalog_id, ac.name
) t1 ON ac.account_catalog_id = t1.account_catalog_id
LEFT JOIN (
    -- Subquery 2: Balance calculation up to the end of the previous month (before '${
      queryParams.date
    }')
    SELECT 
        ac.account_catalog_id, 
        ac.name,
        COALESCE(SUM(gda.debit), 0) AS debit,
        COALESCE(SUM(gda.credit), 0) AS credit,
        CASE
            WHEN ac.number LIKE ANY(ARRAY['1%', '6%']) THEN COALESCE(SUM(gda.debit) - SUM(gda.credit), 0)
            WHEN ac.number LIKE ANY(ARRAY['2%', '3%', '4%']) THEN COALESCE(SUM(gda.credit) - SUM(gda.debit), 0)
        END AS balance
    FROM account_catalog ac
    LEFT JOIN general_diary_account gda ON (ac.account_catalog_id = gda.account_catalog_id)
    LEFT JOIN general_diary gd ON (gda.general_diary_id = gd.general_diary_id)
    --WHERE ac.outlet_id LIKE '${queryParams.outletId}'
    ${getGenericLikeFilter("ac.outlet_id", queryParams.outletId, true)}
        AND gda.status_type = 'ENABLED'
        AND gd.general_diary_id IN (
            SELECT gd.general_diary_id
            FROM general_diary gd
            LEFT JOIN bank_entry_retirement ber ON (gd.general_diary_id = ber.general_diary_id)
            LEFT JOIN check_payment cp ON (gd.general_diary_id = cp.general_diary_id)
            WHERE gd.status_type = 'ENABLED'
            AND (
                ber.target_date < date_trunc('month', '${
                  queryParams.date
                }'::date)  -- Before the first day of the month (2023-12-31)
                OR cp.check_payment_date < date_trunc('month', '${
                  queryParams.date
                }'::date)
                OR (
                    (ber.target_date IS NULL AND cp.check_payment_date IS NULL)
                    AND general_diary_date < date_trunc('month', '${
                      queryParams.date
                    }'::date)
                )
            )
            AND gd.created_by NOT IN ('y.aragonez')
        )
    GROUP BY ac.account_catalog_id, ac.name
) t2 ON ac.account_catalog_id = t2.account_catalog_id
--WHERE ac.outlet_id LIKE '${queryParams.outletId}'
${getGenericLikeFilter("ac.outlet_id", queryParams.outletId, true)}
ORDER BY ac.number;`);

    if (data.length == 0) {
      return [];
    }

    // const parseData = data.map((item) => {
    //   item.prev_credit = parseFloat(item.prev_credit) * -1;
    //   item.actual_credit = parseFloat(item.actual_credit) * -1;

    //   let totalDebit =
    //     parseFloat(item.prev_debit) + parseFloat(item.actual_debit);
    //   let totalCredit =
    //     parseFloat(item.prev_credit) + parseFloat(item.actual_credit);

    //   let sum = totalDebit + totalCredit;

    //   return {
    //     ...item,
    //     sum_debit: sum > 0 ? sum : 0,
    //     sum_credit: sum < 0 ? sum : 0,
    //   };
    // });

    return data;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

controller.getMajorGeneral = async (queryParams) => {
  console.log(queryParams);

  try {
    const [majorGeneral, meta] = await db.query(
      `select ac.number, ac.name, gd.description, 'Deposito ' || ber.description deposit_description,
      'Desembolso a Préstamo '|| l.loan_number_id || ' ' || c.first_name || ' ' || c.last_name as check_description,
      gda.debit, gda.credit, e.first_name || ' ' || e.last_name as employee_name,
      l.loan_number_id loan_number,
      CASE 
        WHEN cp.check_payment_type IS NULL AND ber.target_date IS NOT NULL THEN ber.target_date
        WHEN ber.target_date IS NULL AND cp.check_payment_type IS NOT NULL THEN cp.check_payment_date
        ELSE gd.general_diary_date
      END created_date,
      CASE WHEN cp.check_payment_type = 'DISBURSEMENT' THEN 'CK' || cp.reference_bank
      ELSE ber.reference::varchar
      END reference_bank
      from general_diary gd
      join general_diary_account gda on (gd.general_diary_id = gda.general_diary_id)
      join account_catalog ac on (gda.account_catalog_id = ac.account_catalog_id)
      left JOIN jhi_user u ON (gd.created_by = u.login)
      left JOIN employee e ON (u.employee_id = e.employee_id)
      left join bank_entry_retirement ber ON (gd.general_diary_id = ber.general_diary_id)
      left join check_payment cp on (gd.general_diary_id = cp.general_diary_id)
      left join loan l on (cp.loan_id = l.loan_id)
      left join loan_application la on (l.loan_application_id = la.loan_application_id)
      left join customer c on (la.customer_id = c.customer_id)
      ${getGenericLikeFilter("gd.outlet_id", queryParams.outletId, true)}
     
      AND (
        ber.target_date BETWEEN '${queryParams.dateFrom}' AND '${
        queryParams.dateTo
      }' 
        OR cp.check_payment_date BETWEEN '${queryParams.dateFrom}' AND '${
        queryParams.dateTo
      }'
        OR (
          (ber.target_date IS NULL AND cp.check_payment_date IS NULL)
          AND general_diary_date BETWEEN '${queryParams.dateFrom}' AND '${
        queryParams.dateTo
      }'
          )
        )
      ${getGenericLikeFilter(
        "ac.number",
        queryParams.accountNumber || queryParams.accountName
      )}
      and gd.status_type = 'ENABLED'
      and gd.description not like '%226464%'
      and gd.description not like '%227695%'
      ${
        queryParams.employeeName
          ? `and lower(e.first_name || ' ' || e.last_name) like '${
              `%${queryParams.employeeName?.toLowerCase()}%` || "%"
            }'
        `
          : ""
      }
      ${queryParams.transType == "debit" ? "and gda.debit > 0" : ""}
      ${queryParams.transType == "credit" ? "and gda.credit > 0" : ""}
      and u.login not in ('y.aragonez')
      order by created_date asc`
    );

    const [balanceByAccount] = await db.query(
      `select ac.account_catalog_id, ac.number, ac.name, coalesce(t1.debit,0) debit, coalesce(t1.credit,0)credit
      from account_catalog ac
      left join (select ac.account_catalog_id, sum(gda.debit) debit, sum(gda.credit) credit, abs(sum(debit) - sum(credit)) as balance
        from general_diary gd
        join general_diary_account gda on (gd.general_diary_id = gda.general_diary_id)
        left join bank_entry_retirement ber ON (gd.general_diary_id = ber.general_diary_id)
        left join check_payment cp on (gd.general_diary_id = cp.general_diary_id)
        join account_catalog ac on (gda.account_catalog_id = ac.account_catalog_id)
        left JOIN jhi_user u ON (gd.created_by = u.login)
        ${getGenericLikeFilter("gd.outlet_id", queryParams.outletId, true)}
        AND (
          ber.target_date < date_trunc('month','${
            queryParams.dateFrom
          }'::date) --date_trunc('month','2025-04-04'::date)
          OR cp.check_payment_date < date_trunc('month','${
            queryParams.dateFrom
          }'::date)
          OR (
            (ber.target_date IS NULL AND cp.check_payment_date IS NULL)
            AND general_diary_date < date_trunc('month','${
              queryParams.dateFrom
            }'::date)
            )
          )
        and ac.number like '%'
        and gd.status_type = 'ENABLED'
        and gd.description not like '%226464%'
        and gd.description not like '%227695%'
        and u.login not in ('y.aragonez')
        group by ac.account_catalog_id) t1 on (ac.account_catalog_id = t1.account_catalog_id)
      ${getGenericLikeFilter("ac.outlet_id", queryParams.outletId, true)}
      order by ac.number`
    );

    // console.log(majorGeneral);
    let data = _(majorGeneral).groupBy("number");

    console.log(Object.entries(data).length);

    return { data, balanceByAccount };
  } catch (err) {
    console.log(err);
  }
};

controller.getBoxMajorByEmployee = async (queryParams) => {
  try {
    const [data, metadata] =
      await db.query(`select e.first_name || ' ' || e.last_name as employee_name, count(distinct(gd.payment_id)) transactions,
    sum(gda.debit) debit, sum(gda.credit) credit
    from general_diary gd
    join general_diary_account gda on (gd.general_diary_id = gda.general_diary_id)
    join account_catalog ac on (gda.account_catalog_id = ac.account_catalog_id)
    left join payment p on (gd.payment_id = p.payment_id)
    left join register r on (p.register_id = r.register_id)
    left join jhi_user ju on (r.created_by = ju.login)
    left join employee e on (ju.employee_id = e.employee_id)
    left join outlet o on (gd.outlet_id = o.outlet_id)
    where r.outlet_id like'${queryParams.outletId}%'
    and gd.status_type = 'ENABLED'
    ${
      queryParams.dateFrom
        ? `and p.created_date::date between '${queryParams.dateFrom}' and '${queryParams.dateTo}'`
        : ""
    }
    and ac.number = '1101'
    --and e.first_name is not null
    group by r.created_by, e.first_name, e.last_name
    order by min(general_diary_number_id) desc`);

    return data;
  } catch (error) {
    console.log(error);
  }
};

controller.getPayableAccount = async (queryParams) => {
  console.log(queryParams);
  try {
    const [data] = await db.query(`
    SELECT ap.account_payable_id, ap.account_number_id, ap.supplier_name, ap.rnc, ap.phone, ap.amount_owed, ap.remaining_amount,
	concept, ap.outlet_id, ap.status_type, ap.created_by,
	extract(YEAR FROM ap.created_date) as created_year,
	extract(MONTH FROM ap.created_date) as created_month,
	extract(DAY FROM ap.created_date) as created_day,
	ap.last_modified_by, ap.last_modified_date,
	ap.debit_account, ap.credit_account, ap.ncf,et.name as expense_type, et.code,
	extract(YEAR FROM max(cp.created_date)) as last_payment_year,
	extract(MONTH FROM max(cp.created_date)) as last_payment_month,
	extract(DAY FROM max(cp.created_date)) as last_payment_day,
	max(cp.payment_type) as payment_type
	FROM account_payable ap
	LEFT JOIN expenses_type et ON (ap.expenses_type_id = et.expenses_type_id)
	LEFT JOIN check_payment cp ON (ap.account_payable_id = cp.account_payable_id)
	WHERE ap.outlet_id like'${queryParams.outletId}%'
	AND ap.created_date::date between '${queryParams.dateFrom}' and '${queryParams.dateTo}'
	GROUP BY ap.account_payable_id, ap.account_number_id, ap.supplier_name, ap.rnc, ap.phone, ap.amount_owed, ap.remaining_amount,
	concept, ap.outlet_id, ap.status_type, ap.created_by,
	ap.created_date, ap.created_date, ap.created_date,
	ap.last_modified_by, ap.last_modified_date,
	ap.debit_account, ap.credit_account, ap.ncf,et.name, et.code`);

    return data;
  } catch (error) {
    console.log(error);
  }
};

controller.getToChargeAccount = async (queryParams) => {
  console.log(queryParams);
  try {
    const [data] = await db.query(
      `select c.first_name || ' ' || c.last_name as customer_name, c.identification,
        l.loan_number_id, la.loan_type, l.status_type, l.loan_situation,
        sum(a.amount_of_fee) filter(where a.status_type <> 'DELETE') as total_due,
        coalesce(sum (a.capital) filter(where a.status_type <> 'DELETE' and a.paid = 'true'),0) +
        coalesce(sum (a.total_paid - a.interest) filter(where a.total_paid > a.interest and a.status_type <> 'DELETE' and a.paid = 'false'),0) as total_paid_capital,
        coalesce(sum (a.interest) filter(where a.status_type <> 'DELETE' and a.paid = 'true'),0) +
        coalesce(sum (a.interest) filter(where a.total_paid > a.interest and a.status_type <> 'DELETE' and a.paid = 'false'),0) +
        coalesce(sum (a.total_paid) filter(where a.total_paid <= a.interest and a.status_type <> 'DELETE' and a.paid = 'false'),0)
        as total_paid_interest,
        sum(a.total_paid + a.discount) filter(where a.status_type <> 'DELETE') as total_paid,
        sum(a.amount_of_fee - a.total_paid - a.discount_interest) filter(where a.paid = 'false' and a.status_type <> 'DELETE')
        as total_pending
        from loan l
        join loan_application la on (l.loan_application_id = la.loan_application_id)
        join customer c on (la.customer_id = c.customer_id)
        join amortization a on (l.loan_id = a.loan_id)
        where l.status_type not in ('DELETE', 'PAID', 'REFINANCE')
        AND  l.outlet_id like '${queryParams.outletId || ""}%'
        AND c.identification like '${queryParams.identification || ""}%'
        AND l.loan_number_id::varchar like '${queryParams.loanNumber || ""}%'
        AND l.status_type like '${queryParams.loanStatus || ""}%'
        AND la.loan_type like '${queryParams.loanType || ""}%'
        AND l.loan_situation like '${queryParams.loanSituation || ""}%'
        ${
          Boolean(queryParams.isInterest) == true
            ? `AND a.payment_date::date >= '${queryParams.dateFrom}'`
            : ""
        }
        AND a.payment_date::date <='${queryParams.dateTo}'
        group by l.loan_number_id, la.loan_type, l.status_type, l.loan_situation,
        l.amount_approved, c.first_name, c.last_name, c.identification,l.created_date
        having  coalesce(sum (a.interest) filter(where a.status_type <> 'DELETE' and a.paid = 'true'),0) +
        coalesce(sum (a.interest) filter(where a.total_paid > a.interest and a.status_type <> 'DELETE' and a.paid = 'false'),0) +
        coalesce(sum (a.total_paid) filter(where a.total_paid <= a.interest and a.status_type <> 'DELETE' and a.paid = 'false'),0) > 0
        order by l.created_date desc
        `
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};

controller.getSummarizeMajor = async (queryParams) => {
  try {
    let [data] =
      await db.query(`select employee, employee_name, count(payment_id) transactions,  sum(debit) as debit, sum(credit) as credit
      from
      (select ac.number, ac.name,gd.description, sum(gda.debit) debit, sum(gda.credit) credit,
       r.created_by as employee, r.register_id, p.payment_id, e.first_name || ' ' || e.last_name as employee_name,
      gd.general_diary_date as created_date
      from general_diary_account gda
      join account_catalog ac on (gda.account_catalog_id = ac.account_catalog_id)
      join general_diary gd on (gda.general_diary_id = gd.general_diary_id)
      join payment p on (gd.payment_id = p.payment_id)
      join register r on (p.register_id = r.register_id)
      join jhi_user ju on (r.created_by = ju.login)
      join employee e on (ju.employee_id = e.employee_id)
      where gd.outlet_id='${queryParams.outletId}'
      and gd.general_diary_date between '${queryParams.dateFrom}' and '${
        queryParams.dateTo
      }'
      and ac.number like '${queryParams.accountNumber || ""}%'
      and gd.status_type not in ('DELETE', 'REVERSED')
      and p.status_type <> 'CANCEL'
      and gd.description not like '%226464%'
      and gd.description not like '%227695%'
      and ac.number like '${queryParams.accountNumber || ""}%'
       /*and debit > 188000*/
      group by gd.payment_id, ac.number, ac.name,gd.description,
       gd.general_diary_date,r.created_by, r.register_id, p.payment_id, e.first_name,
       e.last_name
      order by gd.general_diary_date desc
      )t1
      group by employee,employee_name`);

    return data;
  } catch (error) {}
};

controller.getBankDiaryTransactions = async (queryParams) => {
  try {
    const [checkPayment] = await db.query(`
      SELECT t1.check_payment_id as transaction_id, t1.amount, t1.description, t1.status_type, t1.check_payment_type transaction_type, t1.loan_number_id,
      t2.general_diary_id, t2.general_diary_number_id, t2.credit as diary_amount, t1.bank as bank_number, t1.bank_account_id, t1.reference,
      t2.diary_description, t1.check_payment_date as target_date, t1.outlet_id, cd.is_conciliated, CASE
	  	WHEN cl.status_type = 'ENABLED' AND cd.is_conciliated = true THEN true
	    ELSE false
	  END is_conciliated, cd.conciliation_id, t1.reference_bank
      FROM (select cp.check_payment_id, cp.amount, cp.description, cp.reference, cp.status_type, cp.check_payment_date, cp.check_payment_type,
        ba.number as bank, ac.number, cp.bank_account_id, cp.general_diary_id, l.loan_number_id, cp.outlet_id, cp.reference_bank
        from check_payment cp
        left join bank_account ba on (cp.bank_account_id = ba.bank_account_id)
        left join account_catalog ac on (ba.account_catalog_id = ac.account_catalog_id)
        left join loan l on (cp.loan_id = l.loan_id)
        where cp.status_type in ('APPROVED', 'TRANSIT')
        ${getGenericLikeFilter("cp.outlet_id", queryParams.outletId)}
        ${getDateRangeFilter(
          "check_payment_date",
          queryParams.dateFrom,
          queryParams.dateTo,
          false
        )}
        order by check_payment_date desc)t1
      LEFT JOIN (select gd.general_diary_id,
            length(trim(leading '0' from substring(gd.description, position('0' in gd.description), 8))) desc_length,
            trim(leading '0' from substring(gd.description, position('0' in gd.description), 8)) description,
            gd.description as diary_description,
            string_agg(ac.number::varchar , ',') cuentas,
            sum(gda.debit) debit,  sum(gda.credit) credit, gd.general_diary_date, gd.general_diary_number_id
            from general_diary gd
            left join general_diary_account gda on (gd.general_diary_id = gda.general_diary_id)
            left join account_catalog ac on (gda.account_catalog_id = ac.account_catalog_id)
            where lower(gd.description) like any (array['%desembolso%', '%pago%proveedor%'])
            ${getGenericLikeFilter("gd.outlet_id", queryParams.outletId)}
            and number like any (array['110%', '4%', '12%', '21%'])
            ${getDateRangeFilter(
              "general_diary_date",
              queryParams.dateFrom,
              queryParams.dateTo,
              false
            )}
            group by gd.general_diary_id
            order by gd.general_diary_date asc) t2 on (t1.reference::text = t2.description or t1.general_diary_id = t2.general_diary_id)
      left join conciliation_detail cd on (t1.check_payment_id = cd.transaction_id)
      left join conciliation cl on (cd.conciliation_id = cl.conciliation_id AND (cl.status_type = 'ENABLED' or cl.status_type is null))
      where t1.status_type in ('APPROVED', 'TRANSIT')
      ${getGenericLikeFilter("t1.bank_account_id", queryParams.bankAccountId)}
      order by check_payment_date desc

    `);

    const [bankEntryRetire] = await db.query(
      `select ber.bank_entry_retirement_id as transaction_id, ber.amount, ber.description, ber.status_type,
      ber.type_movement as transaction_type, ber.general_diary_id, sum(gda.debit) as diary_amount, ba.number as bank_number,
      ber.bank_account_id, ber.reference, gd.description as diary_description, ber.target_date, ber.outlet_id, ber.created_date,
      CASE
	  	WHEN cl.status_type = 'ENABLED' AND cd.is_conciliated = true THEN true
	    ELSE false
	  END is_conciliated, cd.conciliation_id, gd.general_diary_number_id
      from bank_entry_retirement ber
      left join bank_account ba on (ber.bank_account_id = ba.bank_account_id)
      left join general_diary gd on (ber.general_diary_id = gd.general_diary_id)
      left join general_diary_account gda on (gd.general_diary_id = gda.general_diary_id)
      left join conciliation_detail cd on (ber.bank_entry_retirement_id = cd.transaction_id)
      left join conciliation cl on (cd.conciliation_id = cl.conciliation_id AND (cl.status_type = 'ENABLED' or cl.status_type is null))
      where ber.status_type in ('COMPLETED', 'TRANSIT')
      ${getGenericLikeFilter("ber.outlet_id", queryParams.outletId)}
      ${getDateRangeFilter(
        "ber.target_date",
        queryParams.dateFrom,
        queryParams.dateTo,
        false
      )}
      ${getGenericLikeFilter("ber.bank_account_id", queryParams.bankAccountId)}
      group by ber.bank_entry_retirement_id, ber.amount, ber.description, ber.status_type,
      ber.type_movement, ber.general_diary_id, ba.number, ber.bank_account_id, ber.reference,
      gd.description, ber.target_date, ber.outlet_id, cd.is_conciliated, cd.conciliation_id,
      cl.status_type, gd.general_diary_number_id
      order by ber.target_date desc
      `
    );

    const transactions = checkPayment.concat(...bankEntryRetire);

    const totalIn = transactions
      .filter((i) => i.transaction_type === "ENTRY")
      .reduce((acc, i) => acc + parseFloat(i.amount), 0);

    const totalOut = transactions
      .filter(
        (i) =>
          i.transaction_type === "DISBURSEMENT" ||
          i.transaction_type === "RETIREMENT" ||
          i.transaction_type === "PAYMENT"
      )
      .reduce((acc, i) => acc + parseFloat(i.amount), 0);

    const totalDiaryIn = transactions
      .filter((i) => i.transaction_type === "ENTRY")
      .reduce((acc, i) => acc + parseFloat(i.diary_amount), 0);

    const totalDiaryOut = transactions
      .filter(
        (i) =>
          i.transaction_type === "DISBURSEMENT" ||
          i.transaction_type === "RETIREMENT" ||
          i.transaction_type === "PAYMENT"
      )
      .reduce((acc, i) => acc + parseFloat(i.diary_amount), 0);
    const periodBankBalance = totalIn - totalOut;
    const periodDiaryBalance = totalDiaryIn - totalDiaryOut;
    const differences = transactions.filter((i) => i.amount != i.diary_amount);

    console.log("DIFERENCES QTY", differences.length);

    return {
      periodBankBalance,
      periodDiaryBalance,
      differences,
      transactions,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

controller.getTransactionsFromBankFile = async (queryParams) => {
  try {
    const [[{ bank_id: bankId }]] = await db.query(
      `select bank_id from bank_account where bank_account_id = '${queryParams.bankAccountId}'`
    );

    const data = fs.readFileSync(queryParams.filepath);

    const length = data.toString().split("\n").length;
    console.log(data.toString().split("\n")[1]);
    const parseData = data
      .toString()
      .split("\n")
      .map((item) => item.match(/(?:[^,"']+|"[^"]*"|'[^']*')+/g))
      .slice(0, length - 1);

    fs.unlink(queryParams.filepath, () => {
      console.log("File deleted");
    });

    const formatedData = processTransactionsFormat(bankId, parseData);

    let { transactions: localTransactions } =
      await controller.getBankDiaryTransactions(queryParams);

    const comparedTrasactions = [];

    const [detail] = await db.query(
      `SELECT transactions::json 
      from conciliation_detail cd
      join conciliation cl on (cd.conciliation_id = cl.conciliation_id)
      where cl.status_type not like 'DELETED'`
    );

    let alreadyConciliated = detail.map(
      (item) => item.transactions[0].transaction_id
    );

    localTransactions = localTransactions.filter((item) => {
      if (
        alreadyConciliated.some((sbItem) => sbItem == item.transaction_id) ==
        true
      ) {
        return false;
      } else {
        return true;
      }
    });

    console.log(localTransactions);

    const result = conciliarTransacciones(
      localTransactions.filter(
        (item) =>
          item.status_type == "APPROVED" || item.status_type == "COMPLETED"
      ),
      formatedData
    );

    for (bt of formatedData) {
      const t = localTransactions.find(
        (item) =>
          item.transaction_type == "ENTRY"
            ? item.amount == bt.amount
            : item.reference_bank == bt.reference // && item.target_date == bt.date
      );

      if (t) {
        comparedTrasactions.push({
          transaction_id: t.transaction_id,
          ...bt,
          local_amount: t.amount,
          general_diary_id: t.general_diary_id,
          diary_amount: t.diary_amount,
          transaction_type: t.transaction_type,
          local_date: t.target_date,
          bank_account_id: t.bank_account_id,
          found: true,
          is_conciliated: t.is_conciliated,
        });
      } else {
        comparedTrasactions.push({
          ...bt,
          found: false,
          is_conciliated: false,
        });
      }
    }

    //return comparedTrasactions;
    result.transit = localTransactions.filter(
      (item) => item.status_type == "TRANSIT"
    );
    return result;
  } catch (error) {
    console.error(`Got an error trying to read the file: ${error.message}`);
    throw error;
  }
};

controller.createConciliation = async (data) => {
  console.log(data);
  try {
    const conciliationId = uuid();
    const currentDate = getCurrentISODate();

    const conciliationStm = `INSERT INTO conciliation (
      conciliation_id,
      description,
      start_date,
      end_date,
      created_by,
      last_modified_by,
      created_date,
      last_modified_date,
      status_type,
      outlet_id)
  VALUES('${conciliationId}',
    '${data.description}',
    '${data.dateFrom}',
    '${data.dateTo}',
    '${data.createdBy}',
    '${data.lastModifiedBy}',
    '${currentDate}',
    '${currentDate}',
    'ENABLED',
    '${data.outletId}')`;

    console.log(data);
    //Statements excution
    await db.query(conciliationStm);
    let conciliationDetailStm = "";
    for (t of data.transactions) {
      conciliationDetailStm = `INSERT INTO conciliation_detail (
        transaction_id,
        conciliation_id,
        amount,
        description,
        transaction_type,
        bank_account_id,
        transaction_date,
        is_conciliated,
        adjustment_transaction_id,
        transactions)
        VALUES (
          '${uuid()}',
          '${conciliationId}',
          '${t.bank?.amount || 0}',
          '${t.bank?.description.trim() || ""}',
          '${t.bank?.transaction_type || ""}',
          '${t.local[0]?.bank_account_id}',
          ${t.bank?.date ? "'" + t.bank?.date + "'" : null},
          '${true}',
          '${null}',
          '${JSON.stringify(t.local)}')`;

      await db.query(conciliationDetailStm);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

controller.getConciliations = async (queryParams) => {
  try {
    const statement = `
      select c.*, o.name outlet_name, cd.transaction_id, cd.amount,  cd.amount as local_amount, cd.description transaction_description,
      cd.transaction_type, cd.bank_account_id, to_char(cd.transaction_date::date, 'dd-mm-yyy') as date, is_conciliated,
      cd.adjustment_transaction_id, ba.number bank_account, cd.transactions::json
      from conciliation c
      join conciliation_detail cd on (c.conciliation_id = cd.conciliation_id)
      left join bank_account ba on (cd.bank_account_id = ba.bank_account_id)
      left join outlet o on (c.outlet_id  = o.outlet_id)
      WHERE c.status_type NOT IN ('DELETED')
      ${getDateRangeFilter(
        "c.start_date",
        queryParams.dateFrom,
        queryParams.dateTo
      )}
      ${getGenericLikeFilter("c.outlet_id", queryParams.outletId)}
      ${getGenericLikeFilter("cd.bank_account_id", queryParams.bankAccountId)}
      `;

    const [data] = await db.query(statement);

    const result = _(data)
      .groupBy("conciliation_id")
      .map((items, conciliation_id) => ({
        conciliation_id,
        description: items[0].description,
        start_date: items[0].start_date,
        end_date: items[0].end_date,
        outlet_id: items[0].outlet_id,
        outlet_name: items[0].outlet_name,
        amount: items[0].amount,
        status:
          items?.every((item) => item.is_conciliated == true) == true
            ? "Completada"
            : "En proceso",
        bankTransactions: [...items],
      }));

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

controller.removeConciliation = async (queryParams) => {
  try {
    const statement = `UPDATE conciliation SET status_type = 'DELETED' WHERE conciliation_id = '${queryParams.conciliationId}'`;

    await db.query(statement);

    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

function getMainAccountsArr(arr) {
  let testAccounts = [];
  for (let i = 0; i < arr.length; i++) {
    let controlledAccounts = arr.filter(
      (item) => item.control_account === arr[i].account_catalog_id
    );

    if (arr[i].control_account === null && arr[i].is_control === true) {
      // arr[i].balance = arr
      //   .filter((subItem) => subItem.control_account == arr[i].control_account)
      //   .reduce((acc, item) => acc + parseFloat(item.balance), 0);
      testAccounts.push({
        ...arr[i],
        controlledAccounts,
      });
    }
  }

  return testAccounts;
}

function getAccountsArr(baseArr, arr) {
  let testAccounts = [];
  arr = arr?.map((item, index) => {
    return {
      ...item,
      controlledAccounts: baseArr.filter(
        (element) => element.control_account === item.account_catalog_id
      ),
    };
  });

  for (let i = 0; i < arr?.length; i++) {
    testAccounts.push({
      ...arr[i],
      controlledAccounts:
        arr[i]?.controlledAccounts?.length > 0
          ? getAccountsArr(baseArr, arr[i].controlledAccounts)
          : [],
    });
  }

  // console.log(testAccounts);

  return testAccounts;
}

function buildAccountTree(flatAccounts) {
  const accountMap = new Map();

  // Initialize each account with an empty controlledAccounts array
  flatAccounts.forEach((account) => {
    accountMap.set(account.account_catalog_id, {
      ...account,
      controlledAccounts: [],
    });
  });

  const tree = [];

  flatAccounts.forEach((account) => {
    if (account.control_account === null) {
      tree.push(accountMap.get(account.account_catalog_id)); // Root accounts
    } else {
      const parent = accountMap.get(account.control_account);
      if (parent) {
        parent.controlledAccounts.push(
          accountMap.get(account.account_catalog_id)
        ); // Nest children
      }
    }
  });

  return { tree, accountMap }; // Return both the hierarchy and the map for easy lookup
}

function calculateBalance(account) {
  if (!account.controlledAccounts || account.controlledAccounts.length === 0) {
    account.totalBalance = parseFloat(account.balance); // Base case: only own balance
    return account.totalBalance;
  }

  let totalBalance = parseFloat(account.balance);

  for (let subAccount of account.controlledAccounts) {
    totalBalance += calculateBalance(subAccount);
  }

  account.totalBalance = totalBalance; // Store computed balance
  return parseFloat(totalBalance);
}

function getPrevAccountBalance(accountList, currentAccount, prevBalance) {
  let accounts = accountList.filter(
    (item) => item.control_account == currentAccount.account_catalog_id
  );

  if (accounts.length == 0) {
    prevBalance = prevBalance + parseFloat(currentAccount.prev_balance);
  }

  for (item of accounts) {
    let controlledAcccounts = accountList.filter(
      (sItem) => sItem.control_account == item.account_catalog_id
    );

    if (controlledAcccounts.length > 0) {
      prevBalance += getAccountBalance(
        accountList,
        item,
        parseFloat(item.prev_balance)
      );
    } else {
      prevBalance += parseFloat(item.prev_balance);
    }
  }

  return prevBalance;
}

//--------------------- DGI REPORTS --------------------------
let alphabet = [];
for (i = 0; i < 26; i++) {
  alphabet.push((i + 10).toString(36).toUpperCase());
}

controller.generate606 = async (req, res, queryParams) => {
  console.log(queryParams);

  const [outlet] = await db.query(
    `select rnc from outlet where outlet_id like '${queryParams.outletId}%'`
  );

  const [accountPayable, meta] = await db.query(`
  SELECT ap.account_payable_id, ap.account_number_id, ap.supplier_name, ap.rnc, ap.phone, ap.amount_owed, ap.remaining_amount,
	concept, ap.outlet_id, ap.status_type, ap.created_by,
	extract(YEAR FROM ap.created_date) as created_year,
	extract(MONTH FROM ap.created_date) as created_month,
	extract(DAY FROM ap.created_date) as created_day,
	ap.last_modified_by, ap.last_modified_date,
	ap.debit_account, ap.credit_account, ap.ncf,et.name as expense_type, et.code,
	extract(YEAR FROM max(cp.created_date)) as last_payment_year,
	extract(MONTH FROM max(cp.created_date)) as last_payment_month,
	extract(DAY FROM max(cp.created_date)) as last_payment_day,
	max(cp.payment_type) as payment_type
	FROM account_payable ap
	LEFT JOIN expenses_type et ON (ap.expenses_type_id = et.expenses_type_id)
	LEFT JOIN check_payment cp ON (ap.account_payable_id = cp.account_payable_id)
  ${getGenericLikeFilter("ap.outlet_id", queryParams.outletId, true)}
  ${
    queryParams.dateYear
      ? `AND extract(YEAR FROM ap.created_date) = ${queryParams.dateYear}`
      : ""
  }
  ${
    queryParams.dateMonth
      ? `AND extract(MONTH FROM ap.created_date) = ${queryParams.dateMonth.padStart(
          2,
          "0"
        )}`
      : ""
  }
	GROUP BY ap.account_payable_id, ap.account_number_id, ap.supplier_name, ap.rnc, ap.phone, ap.amount_owed, ap.remaining_amount,
	concept, ap.outlet_id, ap.status_type, ap.created_by,
	ap.created_date, ap.created_date, ap.created_date,
	ap.last_modified_by, ap.last_modified_date,
	ap.debit_account, ap.credit_account, ap.ncf,et.name, et.code`);

  let rowArr = [
    ...accountPayable.map((ac) => {
      return {
        id: ac.rnc,
        tipoId: 1,
        expenseType: ac.code ? `${ac.code}-${ac.expense_type}` : "",
        ncf: ac.ncf,
        modifiedNcf: "",
        cYearMonth: `${ac.created_year}${
          ac.created_month <= 9 ? `0${ac.created_month}` : `${ac.created_month}`
        }`,
        cDay: `${ac.created_day}`,
        payYearMonth: `${
          ac.remaining_ammount == 0
            ? `${ac.last_payment_year}${ac.last_payment_month}`
            : ""
        }`,
        pDay: `${ac.remaining_ammount == 0 ? `${ac.last_payment_day}` : ""}`,
        billedService: ac.amount_owed,
        billedProducts: 0,
        totalBilled: ac.amount_owed,
        billedITBIS: ac.amount_owed * 0.18,
        notGivenITBIS: 0,
        art349ITBIS: 0,
        atCostITBIS: "",
        toPayBeforeITBIS: 0,
        byPurchaseITBIS: 0,
        isrRetentionType: "",
        rentRetentionAmount: "",
        byPurchaseISR: 0,
        atCosumptionTax: "",
        otherTaxesOrTasas: "",
        legalTipAmount: "",
        paymentType: get606PaymentType(ac.payment_type),
      };
    }),
  ];

  let generatedId = nanoid();
  let filePath = path.join(__dirname, `../../client/public/reports`);
  let fileName = `606-${generatedId}.xlsm`;

  return XlsxPopulate.fromFileAsync(
    path.join(__dirname, "../Formato-de-Envio-606.xlsm")
  ).then(async (workbook) => {
    //Fill preconf-ingo
    workbook
      .sheet("Herramienta Formato 606")
      .cell("C4")
      .value(`${outlet[0].rnc}`);
    workbook
      .sheet("Herramienta Formato 606")
      .cell("C5")
      .value(
        `${queryParams.dateYear}${queryParams.dateMonth.padStart(2, "0")}`
      );
    workbook
      .sheet("Herramienta Formato 606")
      .cell("C6")
      .value(`${rowArr.length}`);

    for (let row = 0; row < rowArr.length; row++) {
      let currentRow = Object.values(rowArr[row]);

      for (i = 0; i < currentRow.length; i++) {
        // console.log(`${alphabet[i + 1]}${12 + row}`);
        workbook
          .sheet("Herramienta Formato 606")
          .cell(`${alphabet[i + 1]}${12 + row}`)
          .value(currentRow[i]);
      }
    }
    // console.log(new Date().toLocaleDateString().trim());

    // console.log(`http://${req.headers.host}/static/reports/${fileName}`);

    // Write to file.
    await workbook.toFileAsync(`${filePath}/${fileName}`);
    return `http://${req.headers.host}/static/reports/${fileName}`;
  });
};

controller.generate607 = async (req, res, queryParams) => {
  console.log(queryParams);

  const [outlet] = await db.query(
    `select rnc from outlet where outlet_id like '${queryParams.outletId}%'`
  );

  const [receipts, meta] = await db.query(`
  select r.receipt_number, pn.ncf_number,c.identification, pn.created_date,
		c.first_name || ' ' || c.last_name as customer_name, sum(a.amount_of_fee) as total_amount,
		sum(a.capital) as capital, sum(a.interest) as interest, sum(a.mora) as mora,
		CASE WHEN p.payment_type = 'CASH' THEN p.pay ELSE 0 END as total_cash,
		CASE WHEN p.payment_type = 'TRANSFER' OR p.payment_type = 'CHECK' THEN p.pay ELSE 0 END as total_check_transfer,
    p.payment_type
		from process_ncf pn
		join payment p on (pn.payment_id = p.payment_id)
		join payment_detail pd on (p.payment_id = pd.payment_id)
		join amortization a on (pd.amortization_id = a.amortization_id)
		join receipt r on (p.payment_id = r.payment_id)
		join customer c on (p.customer_id = c.customer_id)
    ${getGenericLikeFilter("pn.outlet_id", queryParams.outletId, true)}
		--where pn.outlet_id like '${queryParams.outletId}%'
    AND extract(YEAR FROM pn.created_date)  = '${queryParams.dateYear}'
	  AND extract(MONTH FROM pn.created_date)  = '${queryParams.dateMonth}'
		group by r.receipt_number, pn.ncf_number,c.identification, pn.created_date,
		c.first_name, c.last_name, p.pay, p.payment_type`);

  let rowArr = [
    ...receipts.map((r) => {
      return {
        id: r.identification?.split("-").join(""),
        tipoId: 2,
        ncf: r.ncf_number,
        modifiedNCF: "",
        incomeType: "02 - Ingresos Financieros",
        ncfDate:
          r.created_date?.toISOString().split("T")[0].split("-").join("") || "",
        retentionDate: "",
        billedAmount: parseFloat(r.interest) + parseFloat(r.mora),
        billdedITBIS: "",
        expenseType: r.code ? `${r.code}-${r.expense_type}` : "",
        modifiedNcf: "",
        retainedITBIS: "",
        perceivedITBIS: "",
        retentionByThirdSale: "",
        perceivedISR: "",
        consumptionSelectiveTax: "",
        otherTaxes: "",
        legalTip: "",
        totalCash: r.total_cash,
        totalCheck: r.total_check_transfer,
        creditSale: "",
        gitBonus: "",
        permuta: "",
        otherSalesTypes: "",
      };
    }),
  ];

  let generatedId = nanoid();
  let filePath = path.join(__dirname, `../../client/public/reports`);
  let fileName = `607-${generatedId}.xlsm`;

  return XlsxPopulate.fromFileAsync(
    path.join(__dirname, "../Formato-de-Envio-607.xlsm")
  )
    .then(async (workbook) => {
      //Fill preconf-ingo
      workbook
        .sheet("Herramienta Formato 607")
        .cell("C4")
        .value(`${outlet[0].rnc}`);
      workbook
        .sheet("Herramienta Formato 607")
        .cell("C5")
        .value(`${queryParams.dateYear}${queryParams.dateMonth}`);
      workbook
        .sheet("Herramienta Formato 607")
        .cell("C6")
        .value(`${rowArr.length}`);

      for (let row = 0; row < rowArr.length; row++) {
        let currentRow = Object.values(rowArr[row]);

        for (i = 0; i < currentRow.length; i++) {
          console.log(`${alphabet[i + 1]}${12 + row}`);
          workbook
            .sheet("Herramienta Formato 607")
            .cell(`${alphabet[i + 1]}${12 + row}`)
            .value(currentRow[i]);
        }
      }
      console.log(new Date().toLocaleDateString().trim());

      console.log(`http://${req.headers.host}/static/reports/${fileName}`);

      // Write to file.
      await workbook.toFileAsync(`${filePath}/${fileName}`);
      console.log("SENDING RESPONSE TO CLIENT 607");
      return `http://${req.headers.host}/static/reports/${fileName}`;
    })
    .catch((err) => {
      console.log(err);
      return;
    });
};

function get606PaymentType(type) {
  let currentType = "";
  switch (type) {
    case "CASH":
      currentType = "01 - EFECTIVO";
      break;
    case "CHECK":
      currentType = "02 - CHEQUES/TRANSFERENCIAS/DEPÓSITO";
      break;
    case "TRANSFER":
      currentType = "02 - CHEQUES/TRANSFERENCIAS/DEPÓSITO";
      break;
    default:
      currentType = "02 - CHEQUES/TRANSFERENCIAS/DEPÓSITO";
      break;
  }

  return currentType;
}

module.exports = controller;
