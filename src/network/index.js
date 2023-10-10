const express = require("express");
const router = express.Router();
const path = require("path");
const response = require("./response");
const authCtrl = require("../controllers/auth");
const customerCtrl = require("../controllers/customers");
const outletCtrl = require("../controllers/outlets");
const paymentCtrl = require("../controllers/payments");
const loanCtrl = require("../controllers/loans");

module.exports = (app) => {
  router.post("/api/signin", (req, res) => {
    console.log("here");
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

  //Payments
  router.get("/api/payment/today", (req, res) => {
    console.log(req.query);

    paymentCtrl
      .getTodayPayments(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  router.get("/api/payment/canceled", (req, res) => {
    console.log(req.query);

    paymentCtrl
      .getCanceledPayments(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  router.get("/api/payment/received", (req, res) => {
    console.log(req.query);

    paymentCtrl
      .getReceivedPayments(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  router.get("/api/payment/proyection", (req, res) => {
    console.log(req.query);

    paymentCtrl
      .getPaymentProyection(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  router.get("/api/payment/control-history", (req, res) => {
    console.log(req.query);

    paymentCtrl
      .getHistoryPaymentControl(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  //Loans
  router.get("/api/loan", (req, res) => {
    loanCtrl
      .getLoans(req.query)
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
