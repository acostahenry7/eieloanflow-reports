function processTransactionsFormat(bankId, transactions) {
  let result = [];
  switch (bankId) {
    case "11110111":
      result = popular(transactions);
      break;
    case "11110112":
      result = banreservas(transactions);
      break;
    case "11110113":
      result = bhd(transactions);
      break;
    default:
      break;
  }

  return result;
}

function popular(arr) {
  const formatedData = [];
  const itemProperties = [
    "bank_account",
    "date",
    "reference",
    "amount",
    "transaction_type",
    "description",
    "ref",
    "other_1",
    "other_2",
  ];
  for (item of arr) {
    const currentItem = {};
    let index = 0;
    for (e of item) {
      if (index == 0 || index == 3) {
        e = parseFloat(e);
      }

      if (index == 1) {
        const [day, month, year] = e.split("/");
        e = `${year}-${month}-${day}`;
      }

      currentItem[itemProperties[index]] = e;

      index++;
    }
    currentItem.ref = currentItem.reference;
    formatedData.push(currentItem);
  }

  return formatedData;
}

function banreservas(arr) {
  const formatedData = [];
  const itemProperties = [
    "bank_account",
    "date",
    "description",
    "id_ref",
    "amount",
    "amount_2",
    "balance",
    "detail",
    "ref",
    "other_1",
  ];

  for (item of arr) {
    const currentItem = {};
    let index = 0;
    let amount = 0;
    for (e of item) {
      currentItem[itemProperties[index]] = e.replace(/"/g, "");

      index++;
    }

    amount =
      parseFloat(currentItem.amount.replace(/,/g, "")) +
      parseFloat(currentItem.amount_2.replace(/,/g, ""));
    console.log(amount);
    currentItem.amount = amount;
    const [day, month, year] = currentItem.date.split("/");
    currentItem.date = `${year}-${month}-${day}`;
    delete currentItem.amount_2;
    formatedData.push(currentItem);
  }

  return formatedData;
}

function bhd(arr) {
  const formatedData = [];
  const itemProperties = [
    "bank_account",
    "date",
    "unformated_date",
    "amount",
    "transaction_type",
    "description",
    "ref",
    "other_1",
    "other_2",
  ];
  for (item of arr) {
    const currentItem = {};
    let index = 0;
    for (e of item) {
      if (index == 0 || index == 3) {
        e = parseFloat(e);
      }

      if (index == 1) {
        const [day, month, year] = e.split("/");
        e = `${year}-${month}-${day}`;
      }

      currentItem[itemProperties[index]] = e;

      index++;
    }
    formatedData.push(currentItem);
  }

  return formatedData;
}

module.exports = { processTransactionsFormat };
