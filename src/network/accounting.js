const express = require("express");
const router = express.Router();
const response = require("./response");
const accountingCtrl = require("../controllers/accounting");
const multer = require("multer");
const fs = require("fs");
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

  router.get("/api/banks", (req, res) => {
    accountingCtrl
      .getBanks(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  router.get("/api/bank-accounts", (req, res) => {
    accountingCtrl
      .getBankAccounts(req.query)
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

  //CONCILIATION
  router.get("/api/bank-transactions", (req, res) => {
    accountingCtrl
      .getBankDiaryTransactions(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  const storage = multer.diskStorage({
    destination(req, res, cb) {
      const route = path.join(__dirname, `../bank-files`);
      fs.mkdirSync(route, { recursive: true });
      cb(null, route);
    },
    filename(req, file, cb) {
      let fName;
      if (req.body.name.lastIndexOf(".") != -1) {
        fName = req.body.name.substring(0, req.body.name.lastIndexOf("."));
      } else {
        fName = req.body.name;
      }

      console.log("#####", fName);
      let fileExtension = file.originalname.substring(
        file.originalname.lastIndexOf(".") + 1
      );

      const filename = `${fName}.${fileExtension}`;

      req.body = {
        filepath: `${path.join(__dirname, `../bank-files`)}/${filename}`,
        ...req.body,
      };

      cb(null, filename);
    },
  });

  let upload = multer({ storage });

  router.post("/api/bank-file/upload", upload.single("file"), (req, res) => {
    accountingCtrl
      .getTransactionsFromBankFile(req.body)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  // router.get("/api/bank-file-transactions", (req, res) => {
  //   accountingCtrl
  //     .getTransactionsFromBankFile()
  //     .then((msg) => {
  //       response.success(req, res, msg, 200);
  //     })
  //     .catch((err) => {
  //       response.error(req, res, err.message, 500);
  //     });
  // });

  router.post("/api/create-conciliation", (req, res) => {
    accountingCtrl
      .createConciliation(req.body)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  router.get("/api/conciliation", (req, res) => {
    accountingCtrl
      .getConciliations(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  router.delete("/api/conciliation", (req, res) => {
    console.log(req.query);
    accountingCtrl
      .removeConciliation(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  // router.get("/api/conciliation", (req, res) => {
  //   accountingCtrl
  //     .getConciliations(req.query)
  //     .then((msg) => {
  //       response.success(req, res, msg, 200);
  //     })
  //     .catch((err) => {
  //       response.error(req, res, err.message, 500);
  //     });
  // });

  app.use(router);
};
