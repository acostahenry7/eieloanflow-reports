const db = require("../models");
const { generateWhereStatement, getDateRangeFilter } = require("../utils");

const controller = {};

controller.getGeneralBalance = async (queryParams) => {
  let data = {};
  console.log(queryParams);
  //'4a812a14-f46d-4a99-8d88-c1f14ea419f4'

  try {
    const [generalBalance, meta] =
      await db.query(`SELECT ac.account_catalog_id, ac.number, ac.name, ac.description, ac.control_account,
    ac.is_control, ac.status_type, ac.created_by, ac.created_date, ac.last_modified_by, ac.last_modified_date,
    ac.balance as catalog_balance, 
    COALESCE(sum(gda.debit) , 0) as debit,
    COALESCE(sum(gda.credit) , 0)as credit, 
    COALESCE(sum(gda.credit + gda.debit) ,0)as balance, 
    ac.outlet_id
    FROM account_catalog ac
    LEFT JOIN general_diary_account gda ON (ac.account_catalog_id = gda.account_catalog_id ${
      queryParams.dateFrom
        ? `and gda.created_date::date between '${queryParams.dateFrom}' and '${queryParams.dateTo}'`
        : ""
    })
    WHERE outlet_id like '${
      queryParams.outletId || "4a812a14-f46d-4a99-8d88-c1f14ea419f4"
    }'
    GROUP BY ac.account_catalog_id, ac.number, ac.name, ac.description, ac.control_account,
    ac.is_control, ac.status_type, ac.created_by, ac.created_date, ac.last_modified_by, ac.last_modified_date,
    ac.balance, ac.outlet_id
    ORDER BY number`);

    if (data.length == 0) {
      return [];
    }

    let originalData = generalBalance;

    // generalBalance.map((item, index) => {
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
      // if (item.number == "1102") {

      let balance = 0;
      let isParent =
        originalData.filter(
          (sItem) => sItem.control_account == item.account_catalog_id
        ).length > 0;

      if (isParent) balance = parseFloat(item.balance);

      accountBalances.push({
        account_catalog_id: item.account_catalog_id,
        number: item.number,
        name: item.name,
        is_control: item.is_control,
        control_account: item.control_account,
        balance: getAccountBalance(originalData, item, balance),
      });
      //}
    }

    // console.log(accountBalances);

    // let ctrlAccounts = 0;
    // console.log(
    //   (function countControlAccounts(arr) {
    //     // console.log("TESTING OUT", arr);
    //     for (let i = 0; i < arr.length; i++) {
    //       if (arr[i]?.controlledAccounts?.length > 0) {
    //         ctrlAccounts += arr[i].controlledAccounts.length;
    //         countControlAccounts(arr[i].controlledAccounts);
    //       }
    //     }

    //     return ctrlAccounts;
    //   })(accounts)
    // );

    return { accounts, accountBalances };
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

controller.getValidationBalance = async (queryParams) => {
  let data = {};

  try {
    const [data, meta] = await db.query(`SELECT distinct(ac.number), ac.name,
    COALESCE(SUM(gda.debit)
       filter (where extract(month from gda.created_date) = 08 and extract(year from gda.created_date) = 2023),0) as prev_debit,
    COALESCE(SUM(gda.credit)
       filter (where extract(month from gda.created_date) = 08 and extract(year from gda.created_date) = 2023),0) as prev_credit,
    COALESCE(SUM(gda.debit)
       filter (where extract(month from gda.created_date) = 09 and extract(year from gda.created_date) = 2023),0) as actual_debit,
    COALESCE(SUM(gda.credit)
       filter (where extract(month from gda.created_date) = 09 and extract(year from gda.created_date) = 2023),0) as actual_credit
    FROM general_diary_account gda
    JOIN general_diary gd ON (gda.general_diary_id = gd.general_diary_id)
    RIGHT OUTER JOIN account_catalog ac ON (gda.account_catalog_id = ac.account_catalog_id)
    WHERE ac.outlet_id = '4a812a14-f46d-4a99-8d88-c1f14ea419f4'
    GROUP BY ac.number, ac.name
    ORDER BY ac.number`);

    if (data.length == 0) {
      return [];
    }

    const parseData = data.map((item) => {
      item.prev_credit = parseFloat(item.prev_credit) * -1;
      item.actual_credit = parseFloat(item.actual_credit) * -1;

      let totalDebit =
        parseFloat(item.prev_debit) + parseFloat(item.actual_debit);
      let totalCredit =
        parseFloat(item.prev_credit) + parseFloat(item.actual_credit);

      let sum = totalDebit + totalCredit;

      return {
        ...item,
        sum_debit: sum > 0 ? sum : 0,
        sum_credit: sum < 0 ? sum : 0,
      };
    });

    return parseData;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
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
  let accounts = accountList.filter(
    (item) => item.control_account == currentAccount.account_catalog_id
  );

  // console.log({
  //   item: currentAccount.number,
  //   name: currentAccount.name,
  //   balance: currentAccount.balance,
  //   ctrl: accounts.length,
  // });

  // console.log(accounts.length);

  for (item of accounts) {
    let controlledAcccounts = accountList.filter(
      (sItem) => sItem.control_account == item.account_catalog_id
    );

    if (controlledAcccounts.length > 0) {
      balance += getAccountBalance(accountList, item, parseFloat(item.balance));
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

module.exports = controller;
