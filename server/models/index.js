var db = require('../db');

module.exports = {
  messages: {
    get: function () {}, // a function which produces all the messages
    post: function (req, res) {
      // var insertQuery = `INSERT INTO messages (text, userID, roomID) VALUES ('${req.body.message}', 0, 0);`;
      var message = db.connection.escape(req.body.message);
      var insertQuery = `INSERT INTO messages (text) VALUES (${message});`;
      db.connection.query(insertQuery, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.end('');
        }
      });
    } 
  },

  users: {
    get: function () {},
    post: function (req, res) {
      var username = db.connection.escape(req.body.username);
      var insertQuery = `INSERT INTO users (username) VALUES (${username});`; 
      db.connection.query(insertQuery, (err, result) => {
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

