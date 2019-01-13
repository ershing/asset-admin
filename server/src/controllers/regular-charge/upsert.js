const charge = require('../../models/charge');
const uuid = require('uuid/v4');

module.exports = (req, res) => {
    var addData = {
        charge_name,
        op_asset_id,
        charge_type,
        target_id,
        count,
        charge_type,
        begin_time,
        is_flexible_spending
    } = req.body
    for (let key in addData) {
        if (addData[key] === undefined || addData[key] === null || addData[key] === '' || addData[key] === 0)
            return res.send({
                status: 0,
                msg: '参数错误'
            })
    }
    addData.create_time = Date.parse(new Date());
    addData.is_plan = 1;
    addData.charge_id = req.body.charge_id || uuid();
    addData.account_id =  req.body.charge_id || uuid();
    console.log(addData)
    charge.upsert(addData).then(data => {
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