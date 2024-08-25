const express = require("express");
const router = express.Router();
const response = require("./response");
const loanCtrl = require("../controllers/loans");

module.exports = (app) => {
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

  router.get("/api/loan-application-by-month", (req, res) => {
    loanCtrl
      .getLoanApplicationByMonth(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  router.get("/api/loan-by-month", (req, res) => {
    loanCtrl
      .getLoanByMonth(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  router.get("/api/loan-application-by-type", (req, res) => {
    loanCtrl
      .getLoanApplicationByType(req.query)
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

  router.get("/api/payment/grouped-register-close", (req, res) => {
    console.log("hi");
    loanCtrl
      .getGroupedRegisterClose(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  router.get("/api/loan-movement", (req, res) => {
    loanCtrl
      .getLoanMovement(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  router.get("/api/amortization-table", (req, res) => {
    loanCtrl
      .getAmortizationTable(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  router.get("/api/datacredit-loan", (req, res) => {
    loanCtrl
      .getDatacreditLoans(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
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

  app.use(router);
};
