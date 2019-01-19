const asset = require('../../models/asset');
const moment = require('moment');
var async = require('async');

module.exports = (req, res) => {
  if(!req.query.asset_id){
    return res.send({
      status: 0,
      msg: '参数错误'
    });
  }

  var year = (new Date()).getFullYear()
  if (req.query.year) {
    year = req.query.year
  }
  var yearStart = Date.parse(new Date(year, 0, 1));
  var yearEnd = Date.parse(new Date(Number(year) + 1, 0, 1)) - 1000;


  async.parallel([
    checkAssetBase,
    getChargeList
  ], function (err, result) {
    if (err) {
      return res.send({
        status: 0,
        msg: '数据库错误'
      });
    }
    formatTrend(result)
  });


  function checkAssetBase() {
    asset.findOne({
      where: {
        is_delete: 0,
        asset_id: req.query.asset_id,
        charge_time: { $gte: moment(yearStart).format(), $lte: moment(yearEnd).format() }
      }, attributes: ['asset_id', 'asset_name', 'belong_module', 'belong_supporter', 'is_credit_class', 'profit', 'create_time']
    }).then(data => {
      callback(null, data)
    }).catch(e => {
      callback(e)
    })
  }

  function getChargeList() {

  }

  function formatTrend() {

  }


}