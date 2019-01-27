const charge = require('../../models/charge');

module.exports = (req, res) => {
    if (!req.body.charge_id) {
        return res.send({
            status: 0,
            msg: '参数错误'
        })
    }
    charge.update({ is_delete: 1 }, {
        where: {
            $or: [
                { charge_id: req.body.charge_id, is_plan: 1 },
                { plan_charge_id: req.body.charge_id }
            ]
        }
    }).then(data => {
        res.send({
            status: 1
        })
    }).catch(e => {
        res.send({
            status: 0,
            msg: '数据库错误'
        })
    })

}