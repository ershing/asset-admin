var Sequelize = require('sequelize');
const sequelize = require('../index.js');
const moment = require('moment');

//建立对象和数据映射关系
var account = sequelize.define('Account', {
  account_id: {
    type: Sequelize.STRING(36), //数据类型
    field: 'AccountId',// 数据库字段名
    primaryKey: true,  //是否为主键
    allowNull: false, //是否允许为NULL
  },
  login_name: {
    type: Sequelize.STRING(30),
    field: 'LoginName',
    allowNull: false,
    defaultValue: ""
  },
  pwd: {
    type: Sequelize.STRING(300),
    field: 'Pwd',
    allowNull: false,
    defaultValue: ""
  },
  create_time: {
    type: Sequelize.DATE,
    field: 'CreateTime',
    allowNull: false,
    defaultValue: Sequelize.NOW,
    get() {
      return moment(this.getDataValue('create_time')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  is_delete: {
    type: Sequelize.BOOLEAN,
    field: 'IsDelete',
    allowNull: false,
    defaultValue: 0
  }
}, {
    freezeTableName: true, // 模型对应的表名与模型名将相同
    createdAt: false,
    updatedAt: false
  });

account.sync();

module.exports = account;
