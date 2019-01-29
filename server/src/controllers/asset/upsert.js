const asset = require('../../models/asset');
const uuid = require('uuid/v4');

module.exports = (req, res) => {
    var addData = {
        asset_name,
        belong_supporter,
        is_credit_class,
        belong_module,
        profit,
        create_time
    } = req.body
    for (let key in addData) {
        if (addData[key] === undefined || addData[key] === null || addData[key] === '' || addData[key] === 0)
            return res.send({
                status: 0,
                msg: '参数错误'
            })
    }

    addData.asset_id = req.body.asset_id || uuid();
    addData.account_id = req.body.asset_id || uuid();
    asset.upsert(addData).then(data => {
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