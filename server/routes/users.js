"use strict";

const express       = require('express');
const usersRoutes   = express.Router();
const bcrypt        = require('bcrypt');

module.exports = function(DataHelpers) {

  usersRoutes.get("/", (req, res) => {
    let { userId } = req.session;
    let handle = '';
    if(userId) {
      DataHelpers.getUser(userId).then((user) => {
        res.json({ handle: user[0].handle});
      }).catch( (err) => {
        res.statu(500).json({ error: err.message });
      });
    } else {
      res.json({ handle: "" });
    }
  });

// Login, logout, and registering
  usersRoutes.post("/login", (req, res) => {
    let { email, password } = req.body;
    if(!email || !password) {
      res.status(404).send();
    } else {
      let user = { email, password };
      DataHelpers.loginUser(user).then((result) => {
        if(result.length > 0 && bcrypt.compareSync(user.password, result[0].password)) {

          req.session.userId = result[0]['_id'];
          res.status(201).json({ handle: result[0].handle});
        } else {
          // Handle success case of logging in
          res.status(302).send();
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
        DataHelpers.registerUser(user, (err, newUser) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else if(newUser) {
            req.session.userId = user['_id'];
            // Handle success case of adding user to database
            res.status(201).json({ handle: newUser.handle });
          } else {
            // Handle failure to add user
            res.status(302).send();
          }
        });
      }

  });

  return usersRoutes;
};