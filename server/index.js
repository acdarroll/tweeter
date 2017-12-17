"use strict";

// Basic express setup:

const PORT            = 8080;
const express         = require("express");
const bodyParser      = require("body-parser");
const app             = express();
const MongoClient     = require("mongodb").MongoClient;
const sassMiddleware  = require("node-sass-middleware");
const dotenv          = require("dotenv").config();

// Sass middleware to render CSS to the styles folder
app.use(sassMiddleware({
    src: 'stylesheets',
    dest: 'public/styles',
    prefix: '/styles'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Mongo connection URI
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB tweeter db
MongoClient.connect(MONGODB_URI, (err, db) => {
  if(err) throw err;

  // Require DataHelpers then call the module with the database to return our get and save functions
  const DataHelpers = require("./lib/data-helpers.js")(db);

  // Require tweetsRoutes and call the module with our helpers functions
  const tweetsRoutes = require("./routes/tweets")(DataHelpers);

  // Mount the tweets routes at the "/tweets" path prefix:
  app.use("/tweets", tweetsRoutes);

});

app.listen(process.env.PORT || PORT, () => {
  console.log("Example app listening on port " + PORT);
});
