"use strict";

// Require MongoDB to use the ObjectId function for updates
const ObjectId  = require("mongodb").ObjectId;
const bcrypt    = require("bcrypt");

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      db.collection('users').find({
        _id: ObjectId(newTweet.user.id)
      }).toArray().then( (user) => {
        newTweet.user.name = `${user[0].firstName} ${user[0].lastName}`;
        newTweet.user.handle = user[0].handle;
        delete newTweet.user.id;
        db.collection('tweets').insert(newTweet);
      }).then( () => {
        callback(null, true);
      });
    },

    getUser: function(userId) {
      return db.collection('users').find({ _id: ObjectId(userId) }).toArray();
    },

    // Get all tweets in `db`
    getTweets: function() {
      return db.collection('tweets').find().toArray();
    },

    // Save the updated likes to the database
    saveLike: function(userId, newLike, callback) {
        db.collection('tweets').find({ _id: ObjectId(newLike.id) }).toArray((err, data) => {
          console.log("data from saveLike:", data);
          if(!data[0].likes || data[0].likes.indexOf(userId) === -1) {
            db.collection('tweets').update(
              { _id: ObjectId(newLike.id) },
              { $push: { likes: userId } },
              { upsert: true },
              function(err, results) {
                callback(null, true);
              });

            callback(null, true);
          } else {
            db.collection('tweets').update(
              { _id: ObjectId(newLike.id) },
              { $pull: { likes: userId } },
              function(err, results) {
                callback(null, true);
              });
          }
        });
    },

    registerUser: function(user, cb) {
      db.collection('users').find({
        $or: [{ email: user.email }, { handle: user.handle }]
      }).toArray((err, data) => {
        if(data.length > 0) {
          cb(null, false);
        } else {
          db.collection('users').insert(user, (err, user) => {
            cb(null, user);
        });
        }
      });
    },

    loginUser: function(user, cb) {
      return db.collection('users').find({ email: user.email }).toArray();
    }
  };
};
