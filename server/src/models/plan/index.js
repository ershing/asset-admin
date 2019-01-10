const sequelize = require('../index.js');

//建立对象和数据映射关系
var plan = sequelize.define('Plan', {
  plan_id: {
    type: Sequelize.STRING(36), //数据类型
    field: 'PlanId',// 数据库字段名
    primaryKey: true,  //是否为主键
    allowNull: false, //是否允许为NULL
    defaultValue: require('uuid/v4')() //设置默认值
  },
  plan_name: {
    type: Sequelize.STRING(30),
    field: 'PlanName',
    allowNull: false 
  }, 
  status: {
    type: Sequelize.INTEGER,
    field: 'ChargeCode',
    allowNull: false
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
  periodType: {
    type: Sequelize.INTEGER,
    field: 'ChargeCode',
    allowNull: false    
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

plan.sync();

module.exports = { plan };
