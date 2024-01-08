function formatClientName(clientName) {
  let formatedName = "";
  let nameArr = clientName?.split(" ") || "";
  if (nameArr.length > 4) {
    formatedName = `${nameArr[0]} ${nameArr[1]} ${nameArr[2]} ${nameArr[3]}`;
  } else {
    formatedName = clientName;
  }

  return formatedName;
}

function getLoanSituationLabel(loanSituation) {
  let label = "";

  switch (loanSituation) {
    case "RENEGOTIATED":
      label = "Renegociado";
      break;
    case "NORMAL":
      label = "Normal";
      break;
    case "ARREARS":
      label = "Atraso";
      break;
    case "REFINANCE":
      label = "Refinanciado";
      break;
    case "CHANGE_PAYMENT_DATE":
      label = "Cambio de fecha";
      break;
    case "BAD_LOAN":
      label = "DEFINIR";
      break;
    case "TRANSFERRED":
      label = "Transferido";
      break;
    case "EDIT":
      label = "Editado";
      break;
    case "SEIZE":
      label = "Incautado";
      break;
    case "CREATED":
      label = "Creado";
      break;
    case "PAID":
      label = "Pagado";
      break;
    default:
      break;
  }

  return label;
}

function getLoanTypeLabel(loanType) {
  let label = "";

  switch (loanType) {
    case "LOAN_EMPLOYEE":
      label = "Empleado";
      break;
    case "LOAN_PYMES":
      label = "Pymes";
      break;
    case "LOAN_TYPE_VEHICLE":
      label = "Vehículos";
      break;
    case "LOAN_TYPE_PERSONAL":
      label = "Personal";
      break;
    case "LOAN_TYPE_MORTGAGE":
      label = "Hipotecario";
      break;
    case "LOAN_INSURANCE":
      label = "Seguros";
      break;
    case "LOAN_MICRO":
      label = "Micro";
      break;
    default:
      break;
  }

  return label;
}

export { formatClientName, getLoanSituationLabel, getLoanTypeLabel };
