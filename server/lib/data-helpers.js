"use strict";

// Require MongoDB to use the ObjectId function for updates
const ObjectId  = require("mongodb").ObjectId;
const bcrypt    = require("bcrypt");

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
        db.collection('tweets').insert(newTweet);
        callback(null, true);
    },

    getUser: function(userId) {
      return db.collection('users').find({ _id: ObjectId(userId) }).toArray();
    },

    // Get all tweets in `db`
    getTweets: function() {
        return db.collection('tweets').find().toArray();
        // .then((result) => {
          // let tweets = result.toArray();
          // return tweets.sort(sortNewestFirst);
        // });
        // (err, tweets) => {
          // console.log(tweets);
          // cb(null, tweets.sort(sortNewestFirst));
        // });
    },

    // Save the updated likes to the database
    saveLike: function(newLike, callback) {
        db.collection('tweets').update(
          { _id: ObjectId(newLike.id) },
          { $set: { likes: newLike.likes }},
          { upsert: true });
        callback(null, true);
    },

    registerUser: function(user, cb) {
      db.collection('users').find({
        $or: [{ email: user.email }, { handle: user.handle }]
      }).toArray((err, data) => {
        console.log("Register data:", data);
        if(data.length > 0) {
          cb(null, false);
        } else {
          db.collection('users').insert(user);
          cb(null, true);
        }
      });
    },

    loginUser: function(user, cb) {
      return db.collection('users').find({ email: user.email }).toArray();
    }
  };
};
