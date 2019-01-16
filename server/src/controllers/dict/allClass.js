const dict = require('../../models/dict');

module.exports = (req, res) => {
  var dict_name = req.query.dict_name
  if (!dict_name) {
    return res.send({
      status: 0,
      msg: '参数错误'
    })
  }
  dict.findAll({
    where: { is_delete: 0, is_base: 0, dict_name }
  }).then(data => {
    res.send({
      status: 1,
      data: data
    })
  }).catch(e => {
    res.send({
      status: 0,
      msg: '数据库错误'
    })
  })

}