"use strict";

const userHelper    = require("../lib/util/user-helper");

const express       = require('express');
const tweetsRoutes  = express.Router();

const timeDifference = function(tweets) {
  let withInterval = tweets.map( (user) => {        // Calculate the elapsed time server side to avoid
    user.interval = Date.now() - user.created_at;   // inconsistencies
    return user;
  });
  return withInterval;
};

const likedTweets = function(tweets, userId) {
  let likedTweets = tweets.map( (user) => {
    if(user.likes) {
      user.liked = user.likes.indexOf(userId) > -1;
    }
    return user;
  });
  return likedTweets;
};

module.exports = function(DataHelpers) {

  tweetsRoutes.get("/", (req, res) => {
    let { userId } = req.session;
    let tweets;

    const sortNewestFirst = (a, b) => a.created_at - b.created_at;
    DataHelpers.getTweets().then((result) => {
      tweets = result.sort(sortNewestFirst);
      tweets = timeDifference(tweets);
      tweets = likedTweets(tweets, userId);
      res.json(tweets);
    }).catch((err) => {
      res.status(500).json({ error: err.message });
    });
  });

  // Like handling
  tweetsRoutes.post("/:id", (req, res) => {
    if (!req.body.id) {
      res.status(400).send("Bad request: no tweet id in POST body");
      return;
    }
    const userId = req.session.userId;
    if (!userId) {
      res.status(401).send("Unauthorized: must be logged in to like a tweet");
      return;
    }

    const newLike = Object.assign( {}, req.body );

    DataHelpers.saveLike(userId, newLike, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
      }
    });

  });

  tweetsRoutes.post("/", (req, res) => {
    if (!req.body.text) {
      res.status(400).send("Bad request: no data in POST body");
      return;
    }
    if (!req.session.userId) {
      res.status(401).send("Unauthorized: must be logged in to post tweets");
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
