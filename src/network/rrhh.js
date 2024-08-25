const express = require("express");
const router = express.Router();
const response = require("./response");
const rrhhCtrl = require("../controllers/rrhh");

module.exports = (app) => {
  router.get("/api/employee", (req, res) => {
    rrhhCtrl
      .getEmployees(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  app.use(router);
};
