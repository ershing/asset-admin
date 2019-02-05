const asset = require('../../models/asset');
const charge = require('../../models/charge');
const moment = require('moment');
var async = require('async');

module.exports = (req, res) => {
    if (!req.query.asset_id) {
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
                is_delete: 0,
                charge_time: { $gte: moment(yearStart).format(), $lte: moment(yearEnd).format() },
                $or: [{ op_asset_id: req.query.asset_id }]
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


    function formatTrend(results) {
        var target = results[0]
        var charList = results[1]
        var findIndex = findTargetIndex(charList, target.create_time)
        var initIndex = findIndex;
        var profit = target.profit;
        while (initIndex >= 0) {
            profit += (-charList[initIndex].count)
            initIndex--;
        }
        return res.send({
            status: 1,
            data: parseFloat(profit.toFixed(2))
        });
    }


}