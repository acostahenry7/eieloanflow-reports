function processTransactionsFormat(
  bankId,
  transactions,
  notParsedTransactions
) {
  let result = [];
  switch (bankId) {
    case "11110111":
      result = popular(transactions);
      break;
    case "11110112":
      result = banreservas(transactions);
      break;
    case "11110113":
      result = bhd(notParsedTransactions);
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
    formatedData.push({ ...currentItem, origin: "popular" });
  }

  return formatedData;
}

function banreservas(arr) {
  console.log("BAN RESERVAS ARR", arr);
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
    "reference",
    "other_1",
  ];

  for (item of arr) {
    const currentItem = {};
    let index = 0;
    let amount = 0;
    for (e of item) {
      currentItem[itemProperties[index]] = e.replace(/"/g, "");

      if (index == 4 && parseFloat(e.replace(/"/g, "")) > 0) {
        currentItem.transaction_type = "DB";
      }

      if (index == 5 && parseFloat(e.replace(/"/g, "")) > 0) {
        currentItem.transaction_type = "CR";
      }
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
    formatedData.push({ ...currentItem, origin: "banreservas" });
  }

  formatedData.shift();
  return formatedData;
}

function bhd(arr) {
  //console.log(arr);

  // const formatedData = [];
  // const itemProperties = [
  //   "bank_account",
  //   "date",
  //   "unformated_date",
  //   "amount",
  //   "transaction_type",
  //   "description",
  //   "ref",
  //   "other_1",
  //   "other_2",
  // ];
  // for (item of arr) {
  //   const currentItem = {};
  //   let index = 0;
  //   for (e of item) {
  //     if (index == 0 || index == 3) {
  //       e = parseFloat(e);
  //     }

  //     if (index == 1) {
  //       const [day, month, year] = e.split("/");
  //       e = `${year}-${month}-${day}`;
  //     }

  //     currentItem[itemProperties[index]] = e;

  //     index++;
  //   }
  //   formatedData.push(currentItem);
  // }

  // return formatedData;
  console.log("hiii");

  const lineas = arr.trim().split("\n");

  const datos = lineas
    .filter((ln, index) => ln.length > 1 && index > 0)
    .map((linea, index) => {
      //console.log(`LINEA ${index + 1}`, linea, linea.length);

      const date = linea.slice(0, 10).trim();
      const reference = linea.slice(11, 21).trim();
      const description = linea.slice(26, 68).trim();
      const debito = parseFloat(linea.slice(68, 82).replace(/,/g, "")) || 0;
      const credito = parseFloat(linea.slice(82, 95).replace(/,/g, "")) || 0;
      const balance = parseFloat(linea.slice(95).replace(/,/g, "")) || 0;

      return {
        date,
        reference,
        transaction_type: debito > 0 ? "DB" : "CR",
        description,
        amount: debito > 0 ? debito : credito,
        debito,
        credito,
        balance,
        origin: "bhd",
      };
    });

  //console.log(datos);

  return datos;
}

module.exports = { processTransactionsFormat };
