const express = require("express");
const router = express.Router();

const auth = require("./auth");
const outlets = require("./outlets");
const zones = require("./zones");
const customers = require("./customers");
const payments = require("./payments");
const loans = require("./loans");
const accounting = require("./accounting");
const rrhh = require("./rrhh");

const path = require("path");
const response = require("./response");
const processMoraCtrl = require("../controllers/processMora");

module.exports = (app) => {
  //ROUTES INDEX
  //Authentication
  auth(app);
  //Outlets
  outlets(app);
  //Zones
  zones(app);
  //Customers
  customers(app);
  //Payemnts
  payments(app);
  //Loans
  loans(app);
  //Accounting
  accounting(app);
  //RRHH
  rrhh(app);

  //OTHERS
  router.get("/api/proceso-mora", (req, res) => {
    processMoraCtrl
      .fixMoraHandler()
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  //DEFAULT
  router.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../../client/build/index.html"));
  });

  app.use(router);
};
