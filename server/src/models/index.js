var Sequelize = require('sequelize');
var db = require('../../config/db.js');

module.exports = new Sequelize(
  db.name, //数据库名称
  db.user, //用户名
  db.password, //密码
  {
    "dialect": db.dialect,
    "host": db.host,
    "port": db.port
  }//数据库信息
);