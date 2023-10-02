function success(req, res, msg, status) {
  res.status(status || 200).send({
    error: false,
    status: status || 200,
    body: msg || {},
  });
}

function error(req, res, msg, status) {
  res.status(status || 500).send({
    error: true,
    status: status || 500,
    body: msg || "Internal Server error",
  });
}

module.exports = {
  success,
  error,
};
