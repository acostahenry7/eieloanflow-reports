const express = require("express");
const router = express.Router();
const response = require("./response");
const accountingCtrl = require("../controllers/accounting");
const path = require("path");

module.exports = (app) => {
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

  router.get("/api/payable-account", (req, res) => {
    accountingCtrl
      .getPayableAccount(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  router.get("/api/summarize-major", (req, res) => {
    accountingCtrl
      .getSummarizeMajor(req.query)
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

  router.get("/api/box-employee-major", (req, res) => {
    accountingCtrl
      .getBoxMajorByEmployee(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  router.get("/api/charge-account", (req, res) => {
    accountingCtrl
      .getToChargeAccount(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  app.use(router);
};
