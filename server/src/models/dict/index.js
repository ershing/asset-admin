const sequelize = require('../index.js');

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

dict.sync();

module.exports = { dict };
