const express = require("express");
const router = express.Router();
const response = require("./response");
const customerCtrl = require("../controllers/customers");

module.exports = (app) => {
  router.get("/api/customer", (req, res) => {
    customerCtrl
      .getArrearUsers(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  router.get("/api/customer-loan", (req, res) => {
    customerCtrl
      .customerLoans(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  router.get("/api/customer-account-status", (req, res) => {
    customerCtrl
      .getCustomerAccountStatus(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  app.use(router);
};
