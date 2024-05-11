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
    await db.query(`select t1.payment_id, gda.general_diary_account_id, t1.general_diary_number_id, t1.loan_number_id, t1.quota_number, t1.pay,
    t1.pay_mora, t1.interest, t1.missing_interest_seat, t1.missing_box_seat, ac.number
    from (select distinct on (pd.payment_id) pd.payment_id, gd.general_diary_number_id, gd.general_diary_id, l.loan_number_id, 
    a.quota_number,pd.pay, pd.pay_mora, a.interest, 
    case 
      when pd.pay >= a.interest then a.interest
      else pd.pay
    end as missing_interest_seat,
    pd.pay missing_box_seat
    from payment_detail pd
    join amortization a on (pd.amortization_id = a.amortization_id)
    join loan l on (a.loan_id = l.loan_id)
    join general_diary gd on (pd.payment_id = gd.payment_id)
    where pd.payment_id in (select p.payment_id
              from payment p
              left join general_diary gd on (p.payment_id = gd.payment_id)
              left join general_diary_account gda on (gd.general_diary_id = gda.general_diary_id)
              left join account_catalog ac on (gda.account_catalog_id = ac.account_catalog_id)
              left join register r on (p.register_id = r.register_id)
              --left join lan
              --where p.created_by = 'rossy.m'	
              where p.created_date::date between '2024-04-11' and '2024-04-30'
              and p.status_type = 'ENABLED'
              and gd.status_type = 'ENABLED'
              and r.outlet_id = '857b8b3b-d603-4474-9b35-4a90277d9bc0'
              group by p.payment_id, gd.payment_id, gd.status_type
              having p.pay <> coalesce(sum(debit) filter(where ac.number = '1101' and gda.status_type = 'ENABLED'),0)
              )
    order by  pd.payment_id, l.loan_number_id, quota_number desc) t1
    join general_diary_account gda on (t1.general_diary_id = gda.general_diary_id)
    left join account_catalog ac on (gda.account_catalog_id = ac.account_catalog_id)
    order by loan_number_id`);

  console.log(data.length);
  let credits = [];
  for (item of data) {
    switch (item.number) {
      case "1101":
        await db.query(`UPDATE general_diary_account
          SET debit = debit + ${item.missing_box_seat}, credit=0.00
          WHERE general_diary_account_id = '${item.general_diary_account_id}'`);
        break;
      case "1215":
        // await db.query(`UPDATE general_diary_account
        //   SET credit = credit + ${item.pay}, debit=0.00
        //   WHERE general_diary_account_id = '${item.general_diary_account_id}'`);
        credits.push(item.general_diary_account_id);
        break;
      case "2401":
        await db.query(`UPDATE general_diary_account
          SET debit = debit + (debit - ${item.missing_interest_seat}), credit=0.00
          WHERE general_diary_account_id = '${item.general_diary_account_id}'`);
        break;
      case "4101":
        await db.query(`UPDATE general_diary_account
          SET credit = credit +  (credit - ${item.missing_interest_seat}), debit =0.00
          WHERE general_diary_account_id = '${item.general_diary_account_id}'`);
        break;
      case "4102":
        await db.query(`UPDATE general_diary_account
          SET credit = credit +  (credit - ${item.pay_mora}), debit =0.00
          WHERE general_diary_account_id = '${item.general_diary_account_id}'`);
        break;

      default:
        break;
    }

    //console.log(`updated item ${item.loan_number_id} ${item.quota_number}`);
  }
  console.log(data.length);
  return credits;
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
