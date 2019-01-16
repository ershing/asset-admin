const dict = require('../../models/dict');

module.exports = (req, res) => {
    if (!req.body.dict_id) {
        return res.send({
            status: 0,
            msg: '参数错误'
        })
    }
    dict.update({ is_delete: 1 }, { where: { dict_id: req.body.dict_id } }).then(data => {
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