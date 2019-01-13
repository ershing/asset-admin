const charge = require('../../models/charge');
const moment = require('moment');

module.exports = (req, res) => {
    var {
        start_charge_time,
        end_charge_time,
    } = req.query
    charge.findAll({ where: { is_delete: 0, charge_time: {$gte: moment(Number(start_charge_time)).format(), $lte: moment(Number(end_charge_time)).format()} }, attributes: [
        'charge_id',
        'charge_name',
        'op_asset_id',
        'charge_type',
        'target_id',
        'count',
        'charge_time',
        'is_flexible_spending'
    ] }).then(data => {
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