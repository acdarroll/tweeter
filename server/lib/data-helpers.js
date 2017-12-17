"use strict";

// Require MongoDB to use the ObjectId function for updates
const ObjectId = require("mongodb").ObjectId;

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
        db.collection('tweets').insert(newTweet);
        callback(null, true);
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
        const sortNewestFirst = (a, b) => a.created_at - b.created_at;
        db.collection('tweets').find().toArray((err, tweets) => {
          callback(null, tweets.sort(sortNewestFirst));
        });
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
      console.log("user in data helper:", user);
      db.collection('users').find({$or: [{ email: user.email }, { handle: user.handle }]}).toArray((err, data) => {
          console.log("Db data:", data);
          if(data) {
            cb(null, false);
          } else {
            db.collection('users').insert(user);
            cb(null, true);
          }
        });
    },

    loginUser: function() {

    }
  };
};
