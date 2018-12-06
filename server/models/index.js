var db = require('../db');
var Promise = require('bluebird');
var queryAsync = Promise.promisify(db.connection.query);
db.connection.queryAsync = queryAsync;

module.exports = {
  messages: {
    get: function () {}, // a function which produces all the messages
    post: function (req, res) {
      
      var username = db.connection.escape(req.body.username);
      var usersSelectQuery = `SELECT id FROM users WHERE username = ${username};`;
      var userIDPromise = db.connection.queryAsync(usersSelectQuery)
        .then(results => {
          if (results.length === 0) {
            var usersInsertQuery = `INSERT INTO users (username) VALUES (${username});`;
            return db.connection.queryAsync(usersInsertQuery)
              .then(results => {
                return results.insertId;
              });
          } else {
            return results[0].id;
          }
        });
      
      var roomname = db.connection.escape(req.body.roomname);
      var roomsSelectQuery = `SELECT id FROM rooms WHERE roomname = ${roomname};`;
      var roomIDPromise = db.connection.queryAsync(roomsSelectQuery)
        .then(results => {
          if (results.length === 0) {
            var roomsInsertQuery = `INSERT INTO rooms (roomname) VALUES (${roomname});`;
            return db.connection.queryAsync(roomsInsertQuery)
              .then(results => {
                return results.insertId;
              });
          } else {
            return results[0].id;
          }
        });
      
      var promiseArray = [userIDPromise, roomIDPromise];
      Promise.all(promiseArray).then((result) => {
        var message = db.connection.escape(req.body.message);
        var userID = result[0];
        var roomID = result[1];
        var insertQuery = `INSERT INTO messages (text, userID, roomID) VALUES (${message}, ${userID}, ${roomID});`;
        db.connection.queryAsync(insertQuery)
          .then(() => {
            res.end();
          });
      });
      
      
      // var userID;
      // var username = db.connection.escape(req.body.username);
      // var selectQuery = `SELECT id FROM users WHERE username = ${username};`;
      // db.connection.query(selectQuery, (err, results) => {
      //   if (err) {
          
      //   } else {
      //     if (results.length === 0) {
      //       // case for no existing user
      //       // INSERT and then grab associated ID
      //       var insertQuery = `INSERT INTO users (username) VALUES (${username});`;
      //       db.connection.query(insertQuery, (err, results) => {
      //         if (err) {
      //           console.log(err);   
      //         } else {
      //           userID = results.insertId;
      //           var message = db.connection.escape(req.body.message);
      //           var insertQuery = `INSERT INTO messages (text, userID, roomID) VALUES (${message}, ${userID}, 0);`;
      //           db.connection.query(insertQuery, (err, results) => {
      //             if (err) {
      //               console.log(err);
      //             } else {
      //               res.end();
      //             }
      //           });
      //         }
      //       });
      //     } else {
      //       // case for existing user
      //       // grab associated ID
      //       userID = results[0].id;
      //       // USE USERID TO INSERT INTO MESSAGES TABLE
      //       var message = db.connection.escape(req.body.message);
      //       var insertQuery = `INSERT INTO messages (text, userID, roomID) VALUES (${message}, ${userID}, 0);`;
      //       db.connection.query(insertQuery, (err, results) => {
      //         if (err) {
      //           console.log(err);
      //         } else {
      //           res.end();
      //         }
      //       });
      //     }
      //     res.end();
      //   }
      // });
      
    } 
  },

  users: {
    get: function () {},
    post: function (req, res) {
      var username = db.connection.escape(req.body.username);
      var selectQuery = `SELECT id FROM users WHERE username = ${username};`;
      db.connection.queryAsync(selectQuery)
        .then((results) => {
          if (results.length === 0) {
            var insertQuery = `INSERT INTO users (username) VALUES (${username});`; 
            db.connection.queryAsync(insertQuery)
              .then(() => {
                res.end();
              });
          } else {
            res.end();
          }
        });
    }
  }
};

