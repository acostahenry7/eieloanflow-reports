const { v4: uuid } = require("uuid");
function conciliarTransacciones(localTransactions, bankTransactions) {
  const dayRange = 8; // Rango permitido de diferencia en días para las fechas (opcional)
  let resutls = [];
  let manualRevisions = [];

  function calcularDiferenciaDias(fecha1, fecha2) {
    const day = 24 * 60 * 60 * 1000;
    const d = Math.abs(new Date(fecha1) - new Date(fecha2));

    return d / day;
  }

  bankTransactions.forEach((bank) => {
    bank.id = uuid();
    let posiblesMatches = localTransactions.filter((local) => {
      return (
        //local.reference_bank == bank.reference &&
        parseFloat(local.diary_amount) == parseFloat(bank.amount)
        //&& calcularDiferenciaDias(local.target_date, bank.date) <= dayRange
      );
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
      const mejorMatch = posiblesMatches.find(
        (local) =>
          local.reference_bank == bank.reference ||
          local.description.includes(bank.descripcion)
      );

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
