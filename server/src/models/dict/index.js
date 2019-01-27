var Sequelize = require('sequelize');
const sequelize = require('../index.js');
const moment = require('moment');
const config = require('../../config/dict.js');
const uuid = require('uuid/v4');

//建立对象和数据映射关系
var dict = sequelize.define('Dict', {
  id: {
    type: Sequelize.STRING(36), //数据类型
    field: 'Id',// 数据库字段名
    primaryKey: true,  //是否为主键
    allowNull: false, //是否允许为NULL
  },
  is_base: {
    type: Sequelize.BOOLEAN,
    field: 'IsBase',
    allowNull: false,
    defaultValue: 0
  },
  account_id: {
    type: Sequelize.STRING(36),
    field: 'AccountId',
    allowNull: true,
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
  classify_id: {
    type: Sequelize.INTEGER,
    field: 'ClassifyId',
    allowNull: true
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
    freezeTableName: true,
    createdAt: false,
    updatedAt: false
  });

dict.sync().then(() => {
  dict.findAll().then(res => {
    if (!res.length) {
      var insertData = []
      var create_time = Date.parse(new Date())
      for (let key in config) {
        var format = config[key].map(ele => ({
          id: uuid(),
          is_base: 1,
          dict_name: key,
          code: ele.code,
          value: ele.value,
          create_time
        }))
        insertData.push(...format)
      }
      dict.bulkCreate(insertData).catch(e => {
        console.log(e)
      })
    }
  })
});

module.exports = dict;
