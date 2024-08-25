const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/auth");
const response = require("./response");

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

  app.use(router);
};
