const express = require("express");
const router = express.Router();
const outletCtrl = require("../controllers/outlets");
const response = require("./response");

module.exports = (app) => {
  router.get("/api/outlet", (req, res) => {
    outletCtrl
      .getOutlets(req.query)
      .then((msg) => {
        response.success(req, res, msg, 200);
      })
      .catch((err) => {
        response.error(req, res, err.message, 500);
      });
  });

  app.use(router);
};
