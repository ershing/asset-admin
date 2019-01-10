const sequelize = require('../index.js');

//建立对象和数据映射关系
var charge = sequelize.define('Charge', {
  charge_id: {
    type: Sequelize.STRING(36), //数据类型
    field: 'ChargeId',// 数据库字段名
    primaryKey: true,  //是否为主键
    allowNull: false, //是否允许为NULL
    defaultValue: require('uuid/v4')() //设置默认值
  },
  charge_code: {
    type: Sequelize.INTEGER,
    field: 'ChargeCode',
    allowNull: false
  },
  charge_type: {
    type: Sequelize.INTEGER,
    field: 'ChargeType',
    allowNull: false
  },  
  charge_for_code: {
    type: Sequelize.INTEGER,
    field: 'ChargeForCode',
    allowNull: false
  },
  spending_type:{
    type: Sequelize.INTEGER,
    field: 'ChargeType',
    allowNull: false
  },
  is_fix_before:{
    type: Sequelize.BOOLEAN,
    field: 'IsFixBefore',
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
  create_time: {
    type: Sequelize.DATE,
    field: 'CreateTime',
    allowNull: false,
    defaultValue: Sequelize.NOW
  }
}, {
    freezeTableName: true, // 模型对应的表名与模型名将相同
    createdAt: false,
    updatedAt: false
  });

charge.sync();

module.exports = { charge };
