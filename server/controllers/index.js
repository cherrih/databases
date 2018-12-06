var models = require('../models');

module.exports = {
  messages: {
    get: function (req, res) {
      models.messages.get(req, res);
    }, // a function which handles a get request for all messages
    post: function (req, res) {
      models.messages.post(req, res);
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      models.users.get(req, res);
    },
    post: function (req, res) {
      models.users.post(req, res);
      //populate the response with whatever was passed from model layer
      //res.end() // gets passed up to client
    }
  }
};



// first file that gets requests from client
// validity checking ???
// pass to modles.messages.get / post
// same with users
  
// result of database query will be passed through res.end()
