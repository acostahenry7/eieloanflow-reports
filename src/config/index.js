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
  app.use(bodyParser.json({ limit: "50mb" }));
  //app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

  //Static
  app.use(express.static(path.join(__dirname, "../../client/build")));
  app.use(
    "/static",
    express.static(path.join(__dirname, "../../client/public"))
  );

  //Routes
  routes(app);

  return app;
};
