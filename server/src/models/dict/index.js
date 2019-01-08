var Sequelize = require('sequelize');
var db = require('../../config/db.js');

//连接数据库
var sequelize = new Sequelize(
  db.name, //数据库名称
  apibase.config.mysql.user, //用户名
  apibase.config.mysql.password, //密码
  {
    "dialect": db.dialect,
    "host": apibase.config.mysql.host,
    "port": apibase.config.mysql.port
  }//数据库信息
);

//建立对象和数据映射关系
var dict = sequelize.define('Dict', {
  dict_id: {
    type: Sequelize.STRING(36), //数据类型
    field: 'DictId',// 数据库字段名
    primaryKey: true,  //是否为主键
    allowNull: false, //是否允许为NULL
    defaultValue: require('uuid/v4')() //设置默认值
  },
  dict_name: {
    type: Sequelize.STRING(30),
    field: 'DictName',
    allowNull: false 
  },  
  code: {
    type: Sequelize.INTEGER,
    field: 'Code',
    allowNull: false
  },
  value: {
    type: Sequelize.STRING(30),
    field: 'Value',
    allowNull: false 
  }
}, {
    freezeTableName: true, // 模型对应的表名与模型名将相同
    createdAt: false,
    updatedAt: false
  });

dict.sync();

//创建或更新数据操作 
function upsert(rowInfo, callback) {
  //同步数据 
  dict.sync().then(function () {
    dict.upsert(rowInfo).then(function (result) {
      // 创建结果
      callback(null, result);
    }).catch(function (err) {
      callback(err, null);
    })
  });
}


//查找一项数据
function findOne(info, callback) {
  //同步数据            用于初始化清除列表数据在sync()中加入：{force: true}
  dict.sync().then(function () {
    dict.findOne({ where: info }).then(function (result) {
      callback(null, result);
    }).catch(function (err) {
      callback(err, null);
    });
  });
}

//查找所有数据
function findAll(rowInfo, callback) {
  //同步数据            用于初始化清除列表数据在sync()中加入：{force: true}
  dict.sync().then(function () {
    dict.findAll(rowInfo).then(function (result) {
      callback(null, result);
    }).catch(function (err) {
      callback(err, null);
    });
  });
}

//查找并统计所有数据
function findAndCountAll(rowInfo, callback) {
  //同步数据            用于初始化清除列表数据在sync()中加入：{force: true}
  dict.sync().then(function () {
    dict.findAndCountAll(rowInfo).then(function (result) {
      callback(null, result);
    }).catch(function (err) {
      callback(err, null);
    });
  });
}

module.exports = {
  "upsert": upsert,
  "get": findOne,
  "getAll": findAll,
  "findAndCountAll": findAndCountAll
};
