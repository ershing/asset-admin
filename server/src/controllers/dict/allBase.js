const dict = require('../../models/dict');

module.exports = (req, res) => {
    dict.findAll({
        where: { is_delete: 0, is_base: 1 }
    }).then(data => {
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