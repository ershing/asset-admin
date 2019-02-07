const asset = require('../../models/asset');
const charge = require('../../models/charge');
const moment = require('moment');
var async = require('async');

module.exports = (req, res) => {
  var searchData = {
    asset_id,
    end_charge_time,
  } = req.query
  for (let key in searchData) {
    if (searchData[key] === undefined || searchData[key] === null || searchData[key] === '' || searchData[key] === 0)
      return res.send({
        status: 0,
        msg: '参数错误'
      })
  }
  var year = (new Date()).getFullYear()
  if (req.query.year) {
    year = req.query.year
  }

  var yearStart = Date.parse(new Date(year, 0, 1));
  var yearEnd = Date.parse(new Date(Number(year) + 1, 0, 1)) - 1000;

  var start_charge_time = req.query.start_charge_time || yearStart
  var searchStartTime = Number(start_charge_time) > yearStart ? Number(start_charge_time) : yearStart
  var searchEndTime = Number(end_charge_time) < yearEnd ? Number(end_charge_time) : yearEnd

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
    if (!result) {
      return res.send({
        status: 0,
        data: []
      });
    }
    formatTrend(result)
  });


  function checkAssetBase(callback) {
    asset.findOne({
      where: {
        is_delete: 0,
        asset_id: req.query.asset_id,
        create_time: { $gte: moment(yearStart).format(), $lte: moment(yearEnd).format() }
      }, attributes: ['asset_id', 'profit', 'create_time']
    }).then(data => {
      callback(null, data)
    }).catch(e => {
      callback(e)
    })
  }

  function getChargeList(callback) {
    charge.findAll({
      where: {
        is_plan: 0,
        is_delete: 0, $or: [{ op_asset_id: req.query.asset_id }],
        charge_time: { $gte: moment(searchStartTime).format(), $lte: moment(searchEndTime).format() }
      },
      order: [['charge_time', 'ASC']],
    }).then(data => {
      callback(null, data)
    }).catch(e => {
      callback(e)
    })
  }

  function findTargetIndex(list, create_time) {
    var findIndex = 0;
    var parseTime = new Date(create_time)
    if (!list.length || parseTime <= new Date(list[0].charge_time)) {
      return -1;
    }
    list.some((ele, index) => {
      if (index !== list.length - 1) {
        if (new Date(list[index].charge_time) <= parseTime && parseTime <= new Date(list[index + 1].charge_time)) {
          findIndex = index
          return true;
        }
      } else {
        findIndex = index
        return true;
      }
    })
    return findIndex
  }

  function getBaseTrendByCharge(list) {
    var baseTrend = []
    list.forEach((ele, index) => {
      if (index === 0) {
        baseTrend[0] = {
          time: list[0].charge_time,
          profit: list[0].count
        }
      } else {
        baseTrend[index] = {
          time: list[index].charge_time,
          profit: parseFloat((baseTrend[index - 1].profit + list[index].count).toFixed(2))
        }
      }
    })
    return baseTrend
  }


  function formatTrend(results) {
    var target = results[0]
    var charList = results[1]
    var findIndex = findTargetIndex(charList, target.create_time)
    var baseTrendCreate = getBaseTrendByCharge(charList)
    var getMoveDistance = findIndex === -1 ? target.profit : target.profit - baseTrendCreate[findIndex].profit
    var assetHistoryList = baseTrendCreate.map(ele => ({ ...ele, profit: parseFloat((ele.profit + getMoveDistance).toFixed(2)) }))

    if (findIndex === -1) {
      assetHistoryList.unshift({ time: target.create_time, profit: target.profit })
    } else {
      if (charList.length) {
        var baser = assetHistoryList[0].profit
        assetHistoryList.unshift({ time: charList[0].charge_time, profit: baser - charList[0].count })
      }
    }
    return res.send({
      status: 1,
      data: assetHistoryList
    });
  }


}