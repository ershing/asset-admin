const asset = require('../../models/asset');
const moment = require('moment')

module.exports = (req, res) => {
    var year = (new Date()).getFullYear()
    if(req.query.year){
        year = req.query.year
    }
    var yearStart = Date.parse(new Date(year, 0, 1));
    var yearEnd = Date.parse(new Date(Number(year) + 1, 0, 1)) - 1000;
    asset.findAll({ where: { is_delete: 0,
        create_time: { $gte: moment(yearStart).format(), $lte: moment(yearEnd).format() }
    }, attributes: ['asset_id', 'asset_name', 'belong_module', 'belong_supporter', 'is_credit_class', 'profit', 'create_time'] }).then(data => {
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