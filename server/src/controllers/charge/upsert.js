const charge = require('../../models/charge');
const uuid = require('uuid/v4');

module.exports = (req, res) => {
    var addData = {
        charge_name,
        op_asset_id,
        charge_type,
        target_id,
        count,
        charge_time,
        is_flexible_spending,
        is_credit_transfer
    } = req.body
    for (let key in addData) {
        if (addData[key] === undefined || addData[key] === null || addData[key] === '' || addData[key] === 0)
            return res.send({
                status: 0,
                msg: '参数错误'
            })
    }
    addData.create_time = Date.parse(new Date());
    addData.charge_id = req.body.charge_id || uuid();
    addData.account_id = req.body.charge_id || uuid();
    charge.upsert(addData).then(data => {
        if (addData.charge_type == 3) {
            var newInsert = JSON.parse(JSON.stringify(addData))
            newInsert.charge_id = uuid()
            newInsert.charge_type = 4
            var temp = newInsert.op_asset_id
            newInsert.op_asset_id = newInsert.target_id
            newInsert.target_id = temp
            newInsert.count = -newInsert.count
            charge.upsert(newInsert).then(data => {
                res.send({
                    status: 1
                })
            })
            return;
        }
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