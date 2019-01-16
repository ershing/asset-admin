const charge = require('../../models/charge');
const moment = require('moment');

module.exports = (req, res) => {
    var searchData = {
        page,
        limit,
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
    charge.findAndCount({
        offset: (page - 1) * limit,
        limit,
        where: { is_delete: 0, is_plan: 0, charge_time: { $gte: moment(Number(start_charge_time)).format(), $lte: moment(Number(end_charge_time)).format() } }, attributes: [
            'charge_id',
            'charge_name',
            'op_asset_id',
            'charge_type',
            'target_id',
            'count',
            'charge_time',
            'is_flexible_spending'
        ], order: [['charge_time', 'DESC']],
        // distinct: true,
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