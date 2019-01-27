var Sequelize = require('sequelize');
const sequelize = require('../index.js');
const moment = require('moment');

//建立对象和数据映射关系
var charge = sequelize.define('Charge', {
  charge_id: {
    type: Sequelize.STRING(36), //数据类型
    field: 'ChargeId',// 数据库字段名
    primaryKey: true,  //是否为主键
    allowNull: false, //是否允许为NULL
  },
  account_id:{
    type: Sequelize.STRING(36),
    field: 'AccountId',
    allowNull: false,
  },  
  charge_name: {
    type: Sequelize.STRING(30),
    field: 'ChargeName',
    allowNull: false
  },  
  op_asset_id: {
    type: Sequelize.INTEGER,
    field: 'OpAssetId',
    allowNull: false
  },
  charge_type: {
    type: Sequelize.INTEGER,
    field: 'ChargeType',
    allowNull: false
  },  
  target_id: {
    type: Sequelize.INTEGER,
    field: 'TargetId',
    allowNull: false
  },
  is_credit_transfer:{
    type: Sequelize.BOOLEAN,
    field: 'IsCreditTransfer',
    allowNull: false,
    defaultValue: 0
  },
  is_flexible_spending: {
    type: Sequelize.BOOLEAN,
    field: 'IsFlexibleSpending',
    allowNull: false,
    defaultValue: 0
  },  
  count: {
    type: Sequelize.FLOAT(10),
    field: 'Count',
    allowNull: false,
    defaultValue: 0.0
  },
  charge_time: {
    type: Sequelize.DATE,
    field: 'ChargeTime',
    allowNull: false,
    defaultValue: Sequelize.NOW,
    get() {
      return moment(this.getDataValue('charge_time')).format('YYYY-MM-DD HH:mm:ss');
    }
  },  
  is_plan: {
    type: Sequelize.BOOLEAN,
    field: 'Is_Plan',
    allowNull: false,
    defaultValue: 0
  },
  plan_charge_id: {
    type: Sequelize.STRING(36),
    field: 'PlanChargeId',
    allowNull: true
  },
  period_type: {
    type: Sequelize.INTEGER,
    field: 'PeriodType',
    allowNull: false,
    defaultValue: 0
  },  
  begin_time: {
    type: Sequelize.DATE,
    field: 'BeginTime',
    allowNull: true,
    defaultValue: Sequelize.NOW,
    get() {
      return moment(this.getDataValue('begin_time')).format('YYYY-MM-DD HH:mm:ss');
    }
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

charge.sync();

module.exports =  charge ;
