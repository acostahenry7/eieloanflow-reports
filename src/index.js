const express = require("express");
const config = require("./config");

const app = config(express());
// serve up production assets

// let the react app to handle any unknown routes
// serve up the index.html if express does'nt recognize the route

app.listen(app.get("port"), () => {
  console.log("Server listening on port " + app.get("port"));
});
