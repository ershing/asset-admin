const charge = require('../../models/charge');
const moment = require('moment');

module.exports = (req, res) => {
    var searchData = {
        charge_type,
        start_charge_time,
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
    var searchStartTime = Number(start_charge_time) > yearStart ? Number(start_charge_time) : yearStart
    var searchEndTime = Number(end_charge_time) < yearEnd ? Number(end_charge_time) : yearEnd
    charge.findAndCount({
        where: { is_delete: 0, is_plan: 0, charge_type: Number(charge_type), charge_time: { $gte: moment(searchStartTime).format(), $lte: moment(searchEndTime).format() } }, attributes: [
            'charge_id',
            'charge_name',
            'op_asset_id',
            'charge_type',
            'target_id',
            'count',
            'charge_time',
            'is_flexible_spending'
        ], order: [['charge_time', 'ASC']]
    }).then(result => {
        res.send({
            status: 1,
            data: result.rows,
            total: result.count
        })
    }).catch(e => {
        res.send({
            status: 0,
            msg: '数据库错误'
        })
    })

}