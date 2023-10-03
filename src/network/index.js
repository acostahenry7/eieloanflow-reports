const express = require("express");
const router = express.Router();
const path = require("path");
const response = require("./response");
const authCtrl = require("../controllers/auth");
const customerCtrl = require("../controllers/customers");
const outletCtrl = require("../controllers/outlets");

module.exports = (app) => {
  router.post("/api/signin", (req, res) => {
    authCtrl
      .signin(req.body)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  //Outlets
  router.get("/api/outlet", (req, res) => {
    outletCtrl
      .getOutlets()
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  //Customers
  router.get("/api/customer", (req, res) => {
    console.log(req.query);

    customerCtrl
      .getArrearUsers(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  router.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../../client/build/index.html"));
  });

  app.use(router);
};
