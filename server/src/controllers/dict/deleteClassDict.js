const dict = require('../../models/dict');

module.exports = (req, res) => {
    if (!req.body.dict_id) {
        return res.send({
            status: 0,
            msg: '参数错误'
        })
    }
    dict.update({ is_delete: 1 }, { where: { id: req.body.dict_id } }).then(data => {
        dict.update({ classify_id: '' }, { where: { classify_id: req.body.dict_id } }).then(data2 => {
            res.send({
                status: 1
            })
        }).catch(e => {
            res.send({
                status: 0,
                msg: '数据库错误'
            })
        })
    }).catch(e => {
        res.send({
            status: 0,
            msg: '数据库错误'
        })
    })

}