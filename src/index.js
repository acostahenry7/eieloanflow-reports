const express = require("express");
const config = require("./config");
const https = require("https");
const fs = require("fs");
const path = require("path");

const app = config(express());

const options = {
  key: fs.readFileSync(path.join(__dirname, "./server.key"), "utf8"),
  cert: fs.readFileSync(path.join(__dirname, "./server.crt"), "utf8"),
  passphrase: process.env.HTTPS_PASSPHRASE || "myeieserver",
};

const server = https.createServer(options, app);

app.listen(app.get("port"), () => {
  console.log("Server listening on port " + app.get("port"));
});
