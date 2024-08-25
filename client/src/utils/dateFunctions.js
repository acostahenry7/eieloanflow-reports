function getPreviousDateByDays(days, isTo) {
  let date = new Date();

  date.setDate(date.getDate() - days);

  if (isTo) {
    console.log("hi");
    let minus = days == 1 ? 1 : 0;
    date.setDate(date.getDate() - minus + days);
    console.log("aaaaaaa", date.toISOString().split("T")[0]);
  }

  return date.toISOString().split("T")[0];
}

function daysInMonth(n) {
  let date = new Date();
  let month = date.getMonth();
  let days = 0;

  if (n == 0) {
    let res = new Date().getDate();
    return res == 1 ? 0 : res;
  }

  for (let i = 0; i < n; i++) {
    days += new Date(date.getFullYear(), month, 0).getDate();
    month--;
  }

  return days;
}

export { getPreviousDateByDays, daysInMonth };
