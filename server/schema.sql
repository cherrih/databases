CREATE DATABASE chat;

USE chat;

CREATE TABLE rooms (
  id INT NOT NULL AUTO_INCREMENT,
  roomname varchar(100),
  PRIMARY KEY (id)
);

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  username varchar(100),
  PRIMARY KEY (id)
);

CREATE TABLE messages (
  id INT NOT NULL AUTO_INCREMENT,
  text varchar(1000),
  createdAt DATETIME,
  userID INT NOT NULL,
  roomID INT NOT NULL,
  FOREIGN KEY (userID)
    REFERENCES users(id)
    ON DELETE CASCADE,
  FOREIGN KEY (roomID) 
    REFERENCES rooms(id)
    ON DELETE CASCADE,  
  PRIMARY KEY (id)
);

/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/

