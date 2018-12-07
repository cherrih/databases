var db = require('../db');
var Promise = require('bluebird');
var queryAsync = Promise.promisify(db.connection.query);
db.connection.queryAsync = queryAsync;

module.exports = {
  messages: {
    
    get: function (req, res) {
      var selectQuery = 'SELECT messages.id, users.username, messages.text, rooms.roomname FROM users, messages, rooms WHERE users.id = messages.userID AND rooms.id = messages.roomID;';
      db.connection.queryAsync(selectQuery)
        .then(results => {
          console.log(results);
          res.end(JSON.stringify(results));
        });
    }, 
    
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
        var message = db.connection.escape(req.body.text);
        var userID = result[0];
        var roomID = result[1];
        var insertQuery = `INSERT INTO messages (text, userID, roomID) VALUES (${message}, ${userID}, ${roomID});`;
        db.connection.queryAsync(insertQuery)
          .then((results) => {
            var dataObject = {id: results.insertId};
            res.end(JSON.stringify(dataObject));
          });
      });
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

