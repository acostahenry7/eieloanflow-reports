const dtCustomSort = (selector) => (rowA, rowB) => {
  const a = parseFloat(selector(rowA)) || 0;
  const b = parseFloat(selector(rowB)) || 0;

  if (a > b) return 1;
  if (b > a) return -1;
  return 0;
};

export { dtCustomSort };
