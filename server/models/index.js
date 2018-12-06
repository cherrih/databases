var db = require('../db');
var Promise = require('bluebird');
var queryAsync = Promise.promisify(db.connection.query);
db.connection.queryAsync = queryAsync;

module.exports = {
  messages: {
    get: function () {}, // a function which produces all the messages
    post: function (req, res) {
      var username = db.connection.escape(req.body.username);
      var selectQuery = `SELECT id FROM users WHERE username = ${username};`;
      var userIDPromise = db.connection.queryAsync(selectQuery)
        .then(results => {
          if (results.length === 0) {
            var insertQuery = `INSERT INTO users (username) VALUES (${username});`;
            return db.connection.queryAsync(insertQuery)
              .then(results => {
                return results.insertId;
              });
          } else {
            return results[0].id;
          }
        });
        
      var promiseArray = [userIDPromise];
      // var promiseArray = [userIDPromise, roomIDPromise];
      Promise.all(promiseArray).then((result) => {
        var message = db.connection.escape(req.body.message);
        var userID = result[0];
        // var roomID = result[1];
        var insertQuery = `INSERT INTO messages (text, userID, roomID) VALUES (${message}, ${userID}, 0);`;
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

