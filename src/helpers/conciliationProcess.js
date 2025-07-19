const { v4: uuid } = require("uuid");
function conciliarTransacciones(localTransactions, bankTransactions) {
  const dayRange = 5; // Rango permitido de diferencia en días para las fechas (opcional)
  let resutls = [];
  let manualRevisions = [];

  function calcularDiferenciaDias(fecha1, fecha2) {
    fecha2 = fecha2.replace(/[\,/]/g, "-");
    fecha2.split("-")[2].length == 4
      ? (fecha2 = fecha2.split("-").reverse().join("-"))
      : null;
    const day = 24 * 60 * 60 * 1000;
    const d = Math.abs(new Date(fecha1) - new Date(fecha2));
    //console.log(new Date(fecha1)- new Date(fecha2));

    return d / day;
  }

  console.log(calcularDiferenciaDias("2025-01-22", "2025-01-23"));

  bankTransactions.forEach((bank, index) => {
    // if (bank.reference == "0000022028") {
    //   console.log(bank);
    // }
    bank.id = uuid();
    let posiblesMatches = localTransactions.filter((local) => {
      // if (local.diary_amount == 14500 && bank.amount == 14500) {
      //   console.log(
      //     "ALGORITHM CHECK",
      //     parseFloat(local.diary_amount) == parseFloat(bank.amount)
      //   );
      // }
      // if (bank.reference == "0000022301") {
      //   console.log(local.target_date, bank.date);
      // }

      let condition;
      let checkTypes = ["DISBURSEMENT", "RETIREMENT", "PAYMENT"];

      if (checkTypes.some((i) => i == local.transaction_type)) {
        condition = bank.reference.includes(local.reference_bank);
        //condition = parseFloat(local.amount) == parseFloat(bank.amount);
      } else {
        condition =
          parseFloat(local.amount) == parseFloat(bank.amount) &&
          calcularDiferenciaDias(local.target_date, bank.date) <= dayRange;
      }

      if (bank.transaction_type == "CR") {
        return condition == true && local.transaction_type == "ENTRY";
      } else {
        return condition == true;
      }

      //local.reference_bank == bank.reference &&
      //&& calcularDiferenciaDias(local.target_date, bank.date) <= dayRange
    });

    if (posiblesMatches.length === 1) {
      // Si solo hay un match claro
      resutls.push({
        bank,
        local: { ...posiblesMatches[0], is_conciliated: true },
        status: "CONCILIATED",
      });

      // Remover del local para evitar dobles matches
      localTransactions = localTransactions.filter(
        (local) => local !== posiblesMatches[0]
      );
    } else if (posiblesMatches.length > 1) {
      // Si hay varios matches, revisar si un la referencia o la descripción coinciden
      if ((bank.reference = "0000000000" && bank.amount == 9500))
        console.log(posiblesMatches, bank.transaction_type);
      let mejorMatch = posiblesMatches.find(
        (local) =>
          local.reference_bank == bank.reference ||
          local.diary_description.includes(bank.descripcion)
      );

      if (bank.origin == "bhd") {
        mejorMatch = posiblesMatches[0];
      }

      if (mejorMatch) {
        resutls.push({
          bank,
          local: { ...mejorMatch, is_conciliated: true },
          status: "CONCILIATED",
        });

        // Remover del local
        localTransactions = localTransactions.filter(
          (local) => local !== mejorMatch
        );
      } else {
        manualRevisions.push({
          bank,
          is_conciliated: false,
          posiblesMatches,
        });
      }
    } else {
      // No hay matches, requiere revisión manual
      manualRevisions.push({
        bank,
        is_conciliated: false,
        posiblesMatches: [],
      });
    }
  });

  // Resultados
  return {
    conciliated: resutls,
    manualRevisions,
    unconciliated: localTransactions,
  };
}

module.exports = conciliarTransacciones;
