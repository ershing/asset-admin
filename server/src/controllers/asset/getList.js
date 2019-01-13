const asset = require('../../models/asset');

module.exports = (req, res) => {
    asset.findAll({ where: { is_delete: 0 }, attributes: ['asset_id', 'asset_name', 'belong_module', 'belong_supporter', 'is_credit_class', 'profit', 'create_time'] }).then(data => {
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