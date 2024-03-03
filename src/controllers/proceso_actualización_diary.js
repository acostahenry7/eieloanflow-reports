const db = require("../models");

const procesoActualizarAsientosContables = async () => {
  try {
    const [data] = await db.query(`SEELC`);


    //Reservation of general_diary_number_id

    let maxDiaryNumberCol =
    await getLastDiaryNumbers(
      req.body.amortization
    );

  console.log(
    "GENERAL DIARY ID FROM GENERAL DIARY",
    maxDiaryNumberCol
  );

  let diaryBulkTransactions =
    await generateDiaryTransactions(
      maxDiaryNumberCol,
      req.body.amortization,
      {
        ...req.body.payment,
        customer:
          currentCustomer[0].first_name +
          " " +
          currentCustomer[0].last_name,
        payment_id:
          paymentDetail.dataValues.payment_id,
      }
    );
  GeneralDiary.bulkCreate(
    diaryBulkTransactions
  )
    .then(async (diary) => {
      console.log("$$$ hace dias", diary);

      let diaryAccountBulkTransactions =
        await setAccountingSeat(
          req.body.amortization,
          {
            ...req.body.payment,
            payment_id:
              paymentDetail.dataValues
                .payment_id,
          },
          diary
        );
      GeneralDiaryAccount.bulkCreate(
        diaryAccountBulkTransactions
      )
        .then((generalDiaryAccount) => {
          res.send(results);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });



  } catch (error) {}
};
