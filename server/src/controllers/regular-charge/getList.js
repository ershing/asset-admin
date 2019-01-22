const charge = require('../../models/charge');
const moment = require('moment');

module.exports = (req, res) => {
    var year = (new Date()).getFullYear()
    if(req.query.year){
        year = req.query.year
    }
    var yearStart = Date.parse(new Date(year, 0, 1));
    var yearEnd = Date.parse(new Date(Number(year) + 1, 0, 1)) - 1000;
    charge.findAll({
        where: { is_delete: 0, is_plan: 1 }, 
        create_time: { $gte: moment(yearStart).format(), $lte: moment(yearEnd).format() },
        attributes: [
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