"use strict";

const userHelper    = require("../lib/util/user-helper");

const express       = require('express');
const tweetsRoutes  = express.Router();

const timeDifference = function(tweets) {
  let withInterval = tweets.map( (user) => {        // Calculate the elapsed time server side to avoid
    let userWithInterval = user;                    // inconsistencies
    user.interval = Date.now() - user.created_at;
    return userWithInterval;
  });
};

module.exports = function(DataHelpers) {

  tweetsRoutes.get("/", (req, res) => {
    let { userId } = req.session;
    let tweets;

    const sortNewestFirst = (a, b) => a.created_at - b.created_at;
    DataHelpers.getTweets().then((result) => {
      tweets = result.sort(sortNewestFirst);
      timeDifference(tweets);
      res.json(tweets);
    }).catch((err) => {
      res.status(500).json({ error: err.message });
    });
  });

  // Like handling
  tweetsRoutes.post("/:id", (req, res) => {
    if (!req.body.id) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    const newLike = Object.assign( {}, req.body );

    DataHelpers.saveLike(newLike, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
      }
    });

  });

  tweetsRoutes.post("/", (req, res) => {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    const user = req.body.user ? req.body.user : userHelper.generateRandomUser();
    user.id = req.session.userId;
    const tweet = {
      user: user,
      content: {
        text: req.body.text
      },
      created_at: Date.now()
    };

    DataHelpers.saveTweet(tweet, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
      }
    });
  });

  return tweetsRoutes;
}
