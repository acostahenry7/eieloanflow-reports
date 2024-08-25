const express = require("express");
const router = express.Router();
const response = require("./response");
const zoneCtrl = require("../controllers/zones");

module.exports = (app) => {
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
  app.use(router);
};
