const db = require("../models");

let controller = {};

controller.fixMoraHandler = async () => {
  const [data, meta] = await db.query(`select * 
                                      from proceso_mora`);

  console.log(data);
  for (item of data) {
    await db.query(`UPDATE amortization
      SET mora = ${item.total_mora}
      WHERE amortization_id = '${item.amortization_id}'
      AND outlet_id = '${item.outlet_id}'`);

    console.log(`updated item ${item.loan_number_id} ${item.quota_number}`);
  }
  return data;
};

// controller.fixMoraHandler = async () => {
//   const [data, meta] =
//     await db.query(`select general_diary_account_id, ac.number, ac.name, debit, credit
//     from general_diary_account gda
//     join account_catalog ac on (gda.account_catalog_id = ac.account_catalog_id)
//     where general_diary_id in (
//     select general_diary_id
//     from general_diary
//     where payment_id = 'c477d726-185e-4e1a-b2a5-07351ebb94b7'
//     limit 70
//     )
//     and ac.number in ('4101', '1101')
//     `);

//   console.log(data.length);
//   for (item of data) {
//     if (item.number == "1101") {
//       await db.query(`UPDATE general_diary_account
//       SET debit = ${item.debit - 69.2},
//       credit = 0.00
//       WHERE general_diary_account_id = '${item.general_diary_account_id}'`);
//     } else {
//       await db.query(`UPDATE general_diary_account
//       SET credit = 0.00,
//       debit = 0.00
//       WHERE general_diary_account_id = '${item.general_diary_account_id}'`);
//     }

//     //console.log(`updated item ${item.loan_number_id} ${item.quota_number}`);
//   }
//   console.log(data.length);
//   return data;
// };

controller.fixMoraHandler = async () => {
  const [data, meta] =
    await db.query(`select general_diary_account_id, general_diary_id, ac.number, ac.name, debit, credit
  from general_diary_account gda
  join account_catalog ac on (gda.account_catalog_id = ac.account_catalog_id)
  where general_diary_id in (
  select general_diary_id
  from general_diary
  where payment_id = 'c477d726-185e-4e1a-b2a5-07351ebb94b7'
  limit 70
  )
  and ac.number in ('4101', '1101')`);

  console.log(data.length);
  for (item of data) {
    if (item.number == "1101") {
      await db.query(`UPDATE general_diary
      SET total = ${item.debit}
      WHERE general_diary_id = '${item.general_diary_id}'`);
    }

    //console.log(`updated item ${item.loan_number_id} ${item.quota_number}`);
  }
  console.log(data.length / 2);
  return data;
};

module.exports = controller;
