var Sequelize = require('sequelize');
const sequelize = require('../index.js');
const moment = require('moment');

//建立对象和数据映射关系
var asset = sequelize.define('Asset', {
  asset_id: {
    type: Sequelize.STRING(36), //数据类型
    field: 'AssetId',// 数据库字段名
    primaryKey: true,  //是否为主键
    allowNull: false, //是否允许为NULL
  },
  account_id:{
    type: Sequelize.STRING(36),
    field: 'AccountId',
    allowNull: false
  },
  asset_name: {
    type: Sequelize.STRING(30),
    field: 'AssetName',
    allowNull: false,
    // unique: true //资产名称不能重复
  },  
  belong_supporter: {
    type: Sequelize.INTEGER,
    field: 'BelongSupporter',
    allowNull: false 
  },
  is_credit_class: {
    type: Sequelize.BOOLEAN,
    field: 'IsCreditClass',
    allowNull: false,
    defaultValue: 0
  },  
  belong_module: {
    type: Sequelize.INTEGER,
    field: 'BelongModule',
    allowNull: false
  },  
  profit: {
    type: Sequelize.FLOAT(10),
    field: 'Profit',
    allowNull: false,
    defaultValue: 0.0
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
  is_delete:{
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

asset.sync();

module.exports =  asset ;
