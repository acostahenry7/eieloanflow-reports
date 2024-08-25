const express = require("express");
const router = express.Router();
const response = require("./response");
const paymentCtrl = require("../controllers/payments");

module.exports = (app) => {
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

  router.get("/api/payment/collector-visits", (req, res) => {
    console.log(req.query);

    paymentCtrl
      .getCollectorVisits(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  router.get("/api/payment/paid-mora", (req, res) => {
    console.log(req.query);

    paymentCtrl
      .getPaidMora(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  router.get("/api/payment/receipt-detail", (req, res) => {
    console.log(req.query);

    paymentCtrl
      .getDetailReceipt(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  app.use(router);
};
