const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const routes = require("../network");

module.exports = (app) => {
  //Port
  app.set("port", process.env.PORT || 3001);

  //Middlewares
  app.use(cors({ origin: "*" }));
  app.use(bodyParser.json());

  //Static
  app.use(express.static(path.join(__dirname, "../../client/build")));
  app.use(
    "/static",
    express.static(path.join(__dirname, "../../client/build"))
  );

  //Routes
  routes(app);

  return app;
};
