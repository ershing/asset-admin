const dict = require('../../models/dict');
const uuid = require('uuid/v4');

module.exports = (req, res) => {
    var addData = {
        id,
        classify_id
    } = req.body
    for (let key in addData) {
        if (addData[key] === undefined || addData[key] === null || addData[key] === 0)
            return res.send({
                status: 0,
                msg: '参数错误'
            })
    }
    addData.account_id = req.body.dict_id || uuid();
    dict.update(addData, { where: { id } }).then(data => {
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