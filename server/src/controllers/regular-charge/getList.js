const charge = require('../../models/charge');

module.exports = (req, res) => {
    charge.findAll({
        where: { is_delete: 0, is_plan: 1 }, attributes: [
            'charge_id',
            'charge_name',
            'op_asset_id',
            'charge_type',
            'target_id',
            'count',
            'period_type',
            'begin_time',
            'is_flexible_spending'
        ]
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