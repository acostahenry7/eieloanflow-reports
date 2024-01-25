const express = require("express");
const router = express.Router();
const path = require("path");
const response = require("./response");
const authCtrl = require("../controllers/auth");
const customerCtrl = require("../controllers/customers");
const outletCtrl = require("../controllers/outlets");
const zoneCtrl = require("../controllers/zones");
const paymentCtrl = require("../controllers/payments");
const loanCtrl = require("../controllers/loans");
const accountingCtrl = require("../controllers/accounting");

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

  //Zones
  router.get("/api/zone", (req, res) => {
    console.log("LOAN QUERYS", req.query);
    zoneCtrl
      .getZones(req.query)
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

  //Loans
  router.get("/api/loan-application", (req, res) => {
    loanCtrl
      .getLoanApplication(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

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

  router.get("/api/loanDetail/:id", (req, res) => {
    console.log(req.params.id);
    loanCtrl
      .getLoanDetails(req)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  router.get("/api/loan-activities", (req, res) => {
    console.log("hi");
    loanCtrl
      .getLoanActivities(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  router.get("/api/loan-discount", (req, res) => {
    console.log("hi");
    loanCtrl
      .getLoanDiscounts(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  router.get("/api/register-close", (req, res) => {
    console.log("hi");
    loanCtrl
      .getRegisterClose(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  //Accounting
  router.get("/api/account-catalog", (req, res) => {
    accountingCtrl
      .accountCatalog(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  router.get("/api/general-balance", (req, res) => {
    console.log("hi");
    accountingCtrl
      .getGeneralBalance(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  router.get("/api/validation-balance", (req, res) => {
    accountingCtrl
      .getValidationBalance(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  router.post("/api/606", (req, res) => {
    accountingCtrl
      .generate606(req, res, req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  router.get("/api/606", (req, res) => {
    console.log(req.query);
    res.download(
      path.join(__dirname, `../../client/public/reports/${req.query.fileName}`)
    );
  });

  router.post("/api/607", (req, res) => {
    accountingCtrl
      .generate607(req, res, req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  router.get("/api/607", (req, res) => {
    console.log(req.query);
    res.download(
      path.join(__dirname, `../../client/public/reports/${req.query.fileName}`)
    );
  });

  router.post("/api/data-credit", (req, res) => {
    loanCtrl
      .generateDatacredit(req, res, req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  router.get("/api/data-credit", (req, res) => {
    console.log(req.query);
    res.download(
      path.join(__dirname, `../../client/public/reports/${req.query.fileName}`)
    );
  });

  router.get("/api/major-general", (req, res) => {
    accountingCtrl
      .getMajorGeneral(req.query)
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
