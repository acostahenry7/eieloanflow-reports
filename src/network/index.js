const express = require("express");
const router = express.Router();
const path = require("path");
const response = require("./response");
const authCtrl = require("../controllers/auth");
const customerCtrl = require("../controllers/customers");

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

  //Customers

  router.get("/api/customer", (req, res) => {
    customerCtrl
      .getArrearUsers()
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
