const charge = require('../../models/charge');

module.exports = (req, res) => {
    var addData = {
      id,
      dict_name,
      code,
      value
    } = req.body
    for (let key in addData) {
        if (addData[key] === undefined || addData[key] === null || addData[key] === '' || addData[key] === 0)
            return res.send({
                status: 0,
                msg: '参数错误'
            })
    }
    addData.create_time = Date.parse(new Date());
    addData.id = req.body.id || uuid();
    addData.account_id =  req.body.charge_id || uuid();
    charge.update(addData).then(data => {
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