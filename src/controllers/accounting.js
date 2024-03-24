const db = require("../models");
const { generateWhereStatement, getDateRangeFilter } = require("../utils");
const path = require("path");
const XlsxPopulate = require("xlsx-populate");
const { nanoid } = require("nanoid");
var _ = require("lodash");

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

controller.getGeneralBalance = async (queryParams) => {
  let data = {};
  // console.log(queryParams);

  let lastMonth =
    queryParams.date?.split("-")[1] == "01"
      ? "12"
      : (parseInt(queryParams.date?.split("-")[1]) - 1).toString();
  let lastYear =
    queryParams.date?.split("-")[1] == "01"
      ? (parseInt(queryParams.date?.split("-")[0]) - 1).toString()
      : queryParams.date?.split("-")[0];

  try {
    const [generalBalance, meta] =
      await db.query(`select ac.account_catalog_id, ac.number, ac.name, ac.description, ac.control_account,
      ac.is_control, ac.status_type, ac.created_by, ac.created_date, ac.last_modified_by, ac.last_modified_date,
      coalesce(t1.debit,0) debit, coalesce(t1.credit, 0)credit,  coalesce(t1.balance,0) balance
      from account_catalog ac
      left join (select ac.account_catalog_id, ac.name,
      coalesce(sum(gda.debit),0) debit,
      coalesce(sum(gda.credit),0) credit,
      coalesce(abs(sum(gda.debit) - sum(gda.credit)),0) balance	
      from account_catalog ac
      left join general_diary_account gda on (ac.account_catalog_id = gda.account_catalog_id)
      left join general_diary gd on (gda.general_diary_id = gd.general_diary_id)
      where ac.outlet_id like '${queryParams.outletId}'
      group by ac.account_catalog_id, ac.name
      having min(gd.general_diary_date) <= '${queryParams.date}' ) t1 on (ac.account_catalog_id = t1.account_catalog_id)
      where ac.outlet_id like '${queryParams.outletId}'
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
    let accounts = getAccountsArr(generalBalance, mainAccounts);
    let accountBalances = [];

    for (item of originalData) {
      let balance = 0;
      let prevBalance = 0;
      let isParent =
        originalData.filter(
          (sItem) => sItem.control_account == item.account_catalog_id
        ).length > 0;

      //if (isParent) balance = parseFloat(item.balance);
      // if (isParent) prevBalance = parseFloat(item.prev_balance);

      accountBalances.push({
        account_catalog_id: item.account_catalog_id,
        number: item.number,
        name: item.name,
        is_control: item.is_control,
        control_account: item.control_account,
        balance: getAccountBalance(originalData, item, balance),
        //prevBalance: getPrevAccountBalance(originalData, item, prevBalance),
      });
    }

    return { accounts, accountBalances };
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

controller.getValidationBalance = async (queryParams) => {
  let data = {};

  console.log(queryParams);

  try {
    const [data, meta] =
      await db.query(`SELECT ac.account_catalog_id, ac.number, ac.name, ac.description, ac.control_account,
    ac.is_control, ac.status_type, ac.created_by, ac.created_date, ac.last_modified_by, ac.last_modified_date,
    ac.balance as catalog_balance,
    /*TIPO DE ASIENTO  ANTERIOR*/
    COALESCE(sum(gda.debit) filter(where gda.created_date::date <= cast(date_trunc('month', '${
      queryParams.date
    }'::date) - interval '1 day' as date))  , 0) as prev_debit,
    COALESCE(sum(gda.credit) filter(where gda.created_date::date <= cast(date_trunc('month', '${
      queryParams.date
    }'::date) - interval '1 day' as date))  , 0)as prev_credit,
    /*BALANCE ANTERIOR*/
    ABS(COALESCE(sum(gda.debit) filter(where gda.created_date::date <= cast(date_trunc('month', '${
      queryParams.date
    }'::date) - interval '1 day' as date))  , 0)-
    COALESCE(sum(gda.credit) filter(where gda.created_date::date <= cast(date_trunc('month', '${
      queryParams.date
    }'::date) - interval '1 day' as date))  , 0)) as prev_balance,
    /*TIPO DE ASIENTO MES*/
    COALESCE(sum(gda.debit) filter(where extract(YEAR from gda.created_date ) = '${
      queryParams.date.split("-")[0]
    }' and extract(MONTH from gda.created_date) = '${
        queryParams.date.split("-")[1]
      }')  , 0) as month_debit,
    COALESCE(sum(gda.credit) filter(where extract(YEAR from gda.created_date ) = '${
      queryParams.date.split("-")[0]
    }' and extract(MONTH from gda.created_date) = '${
        queryParams.date.split("-")[1]
      }') , 0)as month_credit,
    /*BALANCE MES*/
    COALESCE(sum(gda.debit) filter(where extract(YEAR from gda.created_date ) = '${
      queryParams.date.split("-")[0]
    }' and extract(MONTH from gda.created_date)= '${
        queryParams.date.split("-")[1]
      }') , 0)-
    COALESCE(sum(gda.credit) filter(where extract(YEAR from gda.created_date ) = '${
      queryParams.date.split("-")[0]
    }' and extract(MONTH from gda.created_date) = '${
        queryParams.date.split("-")[1]
      }') , 0) as month_balance,
    /*TIPO DE ASIENTO A LA FECHA*/
    COALESCE(sum(gda.debit) filter( where gda.created_date::date <= '${
      queryParams.date
    }'::date ) , 0) as debit,
    COALESCE(sum(gda.credit) filter( where gda.created_date::date <= '${
      queryParams.date
    }'::date ) , 0)as credit,
    /*BALANCE A LA FECHA*/
    ABS(COALESCE(sum(gda.debit) filter( where gda.created_date::date <= '${
      queryParams.date
    }'::date ) , 0) -  
    COALESCE(sum(gda.credit) filter( where gda.created_date::date <= '${
      queryParams.date
    }'::date ) , 0)) as balance,
    ac.outlet_id
    FROM account_catalog ac
    LEFT JOIN general_diary_account gda ON (ac.account_catalog_id = gda.account_catalog_id
    and gda.created_date::date <='${queryParams.date}')
    WHERE outlet_id like '${queryParams.outletId}'
    GROUP BY ac.account_catalog_id, ac.number, ac.name, ac.description, ac.control_account,
    ac.is_control, ac.status_type, ac.created_by, ac.created_date, ac.last_modified_by, ac.last_modified_date,
    ac.balance, ac.outlet_id
    ORDER BY number`);

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
      ` select ac.number, ac.name,gd.description, sum(gda.debit) debit, sum(gda.credit) credit, 
      gd.general_diary_date as created_date
      from general_diary_account gda
      join account_catalog ac on (gda.account_catalog_id = ac.account_catalog_id)
      join general_diary gd on (gda.general_diary_id = gd.general_diary_id)
      join payment p on (gd.payment_id = p.payment_id)
      where gd.outlet_id='${queryParams.outletId}'
      ${
        queryParams.dateFrom
          ? `and gd.general_diary_date between '${queryParams.dateFrom}' and '${queryParams.dateTo}'`
          : ""
      }
      and ac.number like '${queryParams.accountId || "%"}'
      and gd.status_type not in ('DELETE', 'REVERSED')
      and p.status_type <> 'CANCEL'
      and gd.description not like '%226464%'
      and gd.description not like '%227695%'
      group by gd.payment_id, ac.number, ac.name,gd.description,gd.general_diary_date
      order by gd.general_diary_date desc`
    );

    // console.log(majorGeneral);
    let data = _(majorGeneral).groupBy("number");

    return data;
  } catch (err) {
    console.log(err);
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

function getAccountBalance(accountList, currentAccount, balance) {
  //console.log(accountList);

  let accounts = accountList.filter(
    (item) => item.control_account == currentAccount.account_catalog_id
  );

  // console.log({
  //   item: currentAccount.number,
  //   name: currentAccount.name,
  //   balance: currentAccount.balance,
  //   ctrl: accounts.length,
  // });

  if (accounts.length == 0) {
    balance = balance + parseFloat(currentAccount.balance);
  }

  for (item of accounts) {
    let controlledAcccounts = accountList.filter(
      (sItem) => sItem.control_account == item.account_catalog_id
    );

    if (controlledAcccounts.length > 0) {
      // console.log("ITEM BALANCE", item);
      balance += getAccountBalance(accountList, item, parseFloat(item.balance));
      // console.log("GENERAL BALANCE", balance);
    } else {
      balance += parseFloat(item.balance);
    }

    /*getAccountBalance(
      item?.controlledAccounts,
      item?.account_catalog_id
    );*/
  }
  // console.log(balance);

  // if (accounts.length > 0) {
  //   return accounts.reduce((acc, item) => acc + parseFloat(item.balance));
  // }

  return balance;
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
	WHERE ap.outlet_id like'${queryParams.outletId}%'
	AND extract(YEAR FROM ap.created_date)  = '${queryParams.dateYear}'
	AND extract(MONTH FROM ap.created_date)  = '${queryParams.dateMonth}'
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
    workbook.sheet("Herramienta Formato 606").cell("C4").value("40240604682");
    workbook.sheet("Herramienta Formato 606").cell("C5").value("202301");
    workbook
      .sheet("Herramienta Formato 606")
      .cell("C6")
      .value(`${rowArr.length}`);

    for (let row = 0; row < rowArr.length; row++) {
      let currentRow = Object.values(rowArr[row]);

      for (i = 0; i < currentRow.length; i++) {
        console.log(`${alphabet[i + 1]}${12 + row}`);
        workbook
          .sheet("Herramienta Formato 606")
          .cell(`${alphabet[i + 1]}${12 + row}`)
          .value(currentRow[i]);
      }
    }
    console.log(new Date().toLocaleDateString().trim());

    console.log(`http://${req.headers.host}/static/reports/${fileName}`);

    // Write to file.
    await workbook.toFileAsync(`${filePath}/${fileName}`);
    return `http://${req.headers.host}/static/reports/${fileName}`;
  });

  return "ok";
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
		where pn.outlet_id like '${queryParams.outletId}%'
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
