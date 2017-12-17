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
    let { firstName, lastName, handle, email, password } = req.body;
    if(!firstName || !lastName || !handle || !email || !password) {
        // Handle empty strings
        return false;
      } else {
        let user = {  firstName, lastName, handle, email, password };
        console.log("user:", user)
        DataHelpers.registerUser(user, (err, success) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else if(success) {
            console.log("Added");
            res.status(201).send();
          } else {
            console.log("Failed to add");
            res.status(201).send();
          }
        });
      }

  });

  return usersRoutes;
};