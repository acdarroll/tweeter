"use strict";

// Basic express setup:

const PORT          = 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();
const MongoClient   = require("mongodb").MongoClient;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const MONGODB_URI = "mongodb://localhost:27017/tweeter";

MongoClient.connect(MONGODB_URI, (err, db) => {
  if(err) throw err;

  // Require DataHelpers then call the module with the database to return our get and save functions
  const DataHelpers = require("./lib/data-helpers.js")(db);

  // Require tweetsRoutes and call the module with our helpers functions
  const tweetsRoutes = require("./routes/tweets")(DataHelpers);

  // Mount the tweets routes at the "/tweets" path prefix:
  app.use("/tweets", tweetsRoutes);

});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
