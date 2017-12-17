"use strict";

const express       = require('express');
const usersRoutes   = express.Router();

module.exports = function(DataHelpers) {

// Login, logout, and registering
  usersRoutes.post("/login", (req, res) => {
    console.log("Posting to login");
  });

  usersRoutes.post("/logout", (req, res) => {
    console.log("Posting to logout");
  });

  usersRoutes.post("/register", (req, res) => {
    console.log("Posting to register:", req.body);
    let { firstName, lastName, handle, email, password } = req.body;
    if(!firstName || !lastName || !handle || !email || !password) {
        // Handle empty strings
        return false;
      } else {
        let user = {  firstName, lastName, handle, email, password };
        console.log("New user:", user);
        DataHelpers.registerUser(user, (err) => {

        });
      }

  });

  return usersRoutes;
}