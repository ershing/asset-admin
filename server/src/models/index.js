var Sequelize = require('sequelize');
var db = require('../config/db.js');

module.exports = new Sequelize(
  db.name,
  db.user,
  db.password,
  {
    "dialect": db.dialect,
    "host": db.host,
    "port": db.port,
    "storage": db.storage
  }
);