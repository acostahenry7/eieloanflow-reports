const db = require("../models");

let controller = {};

// controller.fixMoraHandler = async () => {
//   const [data, meta] = await db.query(`select *
//                                       from proceso_mora`);

//   console.log(data);
//   for (item of data) {
//     await db.query(`UPDATE amortization
//       SET mora = ${item.total_mora}
//       WHERE amortization_id = '${item.amortization_id}'
//       AND outlet_id = '${item.outlet_id}'`);

//     console.log(`updated item ${item.loan_number_id} ${item.quota_number}`);
//   }
//   return data;
// };

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
    await db.query(`  select  general_diary_account_id, ac.number
  from general_diary_account gda
  join account_catalog ac on (gda.account_catalog_id = ac.account_catalog_id)
  where general_diary_id in (
  select general_diary_id
  from general_diary
  where payment_id = 'd4a6c3a3-d763-4299-9460-a60b1e1eba6a')
  and ac.number in ('1101', '1215')`);

  console.log(data.length);
  for (item of data) {
    if (item.number == "1101") {
      await db.query(`UPDATE general_diary_account
      SET debit = 255.00, credit=0.00
      WHERE general_diary_account_id = '${item.general_diary_account_id}'`);
    } else {
      await db.query(`UPDATE general_diary_account
      SET credit = 255.00, debit=0.00
      WHERE general_diary_account_id = '${item.general_diary_account_id}'`);
    }

    //console.log(`updated item ${item.loan_number_id} ${item.quota_number}`);
  }
  console.log(data.length);
  return data;
};

// controller.fixMoraHandler = async () => {
//   const [data, meta] = await db.query(`
//   select payment_id,  p.outlet_id, l.outlet_id, p.payment_origin, p.created_date::date, l.loan_number_id, p.created_by
//   from payment p
//   left join loan l on (p.loan_id = l.loan_id)
//   where p.outlet_id <> l.outlet_id --32241
//   AND p.created_date::date >= '2024-02-19'
//   order by created_date desc`);

//   console.log(data.length);
//   for (item of data) {
//     await db.query(`UPDATE payment
//         SET outlet_id = '${item.outlet_id}'
//         WHERE payment_id = '${item.payment_id}'`);

//     //console.log(`updated item ${item.loan_number_id} ${item.quota_number}`);
//   }
//   console.log(data.length / 2);
//   return data;
// };

module.exports = controller;
