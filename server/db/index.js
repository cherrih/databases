var mysql = require('mysql');

// Create a database connection and export it from this file.
// You will need to connect with the user "student", password "student",
// and to the database "chat".

dbConnection = mysql.createConnection({
  user: 'student',
  password: 'student',
  database: 'chat'
});

dbConnection.connect();

module.exports.connection = dbConnection;