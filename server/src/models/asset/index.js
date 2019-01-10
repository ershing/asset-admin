const sequelize = require('../index.js');

//建立对象和数据映射关系
var asset = sequelize.define('Asset', {
  asset_id: {
    type: Sequelize.STRING(36), //数据类型
    field: 'AssetId',// 数据库字段名
    primaryKey: true,  //是否为主键
    allowNull: false, //是否允许为NULL
    defaultValue: require('uuid/v4')() //设置默认值
  },
  code: {
    type: Sequelize.INTEGER,
    field: 'Code',
    allowNull: false
  },
  belong_type: {
    type: Sequelize.INTEGER,
    field: 'BelongType',
    allowNull: false 
  },
  is_credit_class: {
    type: Sequelize.BOOLEAN,
    field: 'IsCreditClass',
    allowNull: false,
    defaultValue: 0
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
    defaultValue: Sequelize.NOW
  }
}, {
    freezeTableName: true, // 模型对应的表名与模型名将相同
    createdAt: false,
    updatedAt: false
  });

asset.sync();

module.exports = { asset };
