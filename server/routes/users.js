"use strict";

const express       = require('express');
const usersRoutes   = express.Router();
const bcrypt        = require('bcrypt');

module.exports = function(DataHelpers) {

// Login, logout, and registering
  usersRoutes.post("/login", (req, res) => {
    let { email, password } = req.body;
    if(!email || !password) {
      return false;
    } else {
      let user = { email, password };
      DataHelpers.loginUser(user).then((result) => {
        if(result.length > 0 && bcrypt.compareSync(user.password, result[0].password)) {

          console.log("Logged in");
          req.session.userId = result[0]['_id'];
          res.status(201).send();
        } else {
          console.log("Failed to log in");
          // Handle success case of logging in
          res.status(201).send();
        }
      }).catch((err) => {
        res.status(500).json({ error: err.message });
      });
    }
  });

  usersRoutes.post("/logout", (req, res) => {
    req.session = null;
    res.status(201).send();
  });

  usersRoutes.post("/register", (req, res) => {
    let { firstName, lastName, handle, email, password } = req.body;
    if(!firstName || !lastName || !handle || !email || !password) {
        // Handle empty strings
        return false;
      } else {
        let user = {
          firstName,
          lastName,
          handle,
          email,
          password: bcrypt.hashSync(password, 10)
        };
        DataHelpers.registerUser(user, (err, success) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else if(success) {
            console.log("User registered");
            // Handle success case of adding user to database
            res.status(201).send();
          } else {
            console.log("Error registering");
            // Handle failure to add user
            res.status(201).send();
          }
        });
      }

  });

  return usersRoutes;
};