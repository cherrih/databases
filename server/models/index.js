var db = require('../db');

module.exports = {
  messages: {
    get: function () {}, // a function which produces all the messages
    post: function (req, res) {
      
      // GET APPROPRIATE USERID FROM USERS TABLE
      var userID;
      var username = db.connection.escape(req.body.username);
      var selectQuery = `SELECT id FROM users WHERE username = ${username};`;
      db.connection.query(selectQuery, (err, results) => {
        if (err) {
          
        } else {
          if (results.length === 0) {
            // case for no existing user
            // INSERT and then grab associated ID
            var insertQuery = `INSERT INTO users (username) VALUES (${username});`;
            db.connection.query(insertQuery, (err, results) => {
              if (err) {
                console.log(err);   
              } else {
                userID = results.insertId;
                var message = db.connection.escape(req.body.message);
                var insertQuery = `INSERT INTO messages (text, userID, roomID) VALUES (${message}, ${userID}, 0);`;
                db.connection.query(insertQuery, (err, results) => {
                  if (err) {
                    console.log(err);
                  } else {
                    res.end();
                  }
                });
              }
            })
          } else {
            // case for existing user
            // grab associated ID
            userID = results[0].id;
            // USE USERID TO INSERT INTO MESSAGES TABLE
            var message = db.connection.escape(req.body.message);
            var insertQuery = `INSERT INTO messages (text, userID, roomID) VALUES (${message}, ${userID}, 0);`;
            db.connection.query(insertQuery, (err, results) => {
              if (err) {
                console.log(err);
              } else {
                res.end();
              }
            });
          }
          res.end();
        }
      })
      
      // GET APPROPRIATE ROOMID FROM ROOMS TABLE
      
      // USE USERID AND ROOMID TO INSERT INTO MESSAGES TABLE


      
      
    } 
  },

  users: {
    get: function () {},
    post: function (req, res) {
      var username = db.connection.escape(req.body.username);
      var insertQuery = `INSERT INTO users (username) VALUES (${username});`; 
      db.connection.query(insertQuery, (err, results) => {
        if (err) {
          // console.log(err);
        } else {
          // console.log(result);
          res.end('');
        }
      });
      // populate response with result of query
      // res.end() // gets passed up to controller
    }
  }
};

// gets passsed requests from controller layer
// generate appropriate sql query 
// queries the database layer
// pass result of query to controller layer

