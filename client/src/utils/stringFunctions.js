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

export { formatClientName };
