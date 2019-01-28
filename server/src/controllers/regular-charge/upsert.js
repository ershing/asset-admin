const charge = require('../../models/charge');
const uuid = require('uuid/v4');


module.exports = (req, res) => {
    var year = (new Date()).getFullYear()
    if (req.query.year) {
        year = req.query.year
    }
    var yearStart = Date.parse(new Date(year, 0, 1));
    var yearEnd = Date.parse(new Date(Number(year) + 1, 0, 1)) - 1000;
    var addData = {
        charge_name,
        op_asset_id,
        charge_type,
        target_id,
        count,
        charge_time,
        begin_time,
        is_flexible_spending,
        is_credit_transfer,
        period_type
    } = req.body
    for (let key in addData) {
        if (addData[key] === undefined || addData[key] === null || addData[key] === '' || addData[key] === 0)
            return res.send({
                status: 0,
                msg: '参数错误'
            })
        if (Number(begin_time) < yearStart || Number(begin_time) > yearEnd) {
            return res.send({
                status: 0,
                msg: '参数错误'
            })
        }
    }
    addData.is_plan = true;
    addData.create_time = Date.parse(new Date());
    addData.charge_id = req.body.charge_id || uuid();
    addData.account_id = req.body.charge_id || uuid();
    charge.upsert(addData).then(data => {
        // 制定的计划按本年度插入相关未来账单
        var upsertList = []
        var targetTime = Number(begin_time)
        var baseDate = (new Date(targetTime)).getDate()

        while (targetTime <= yearEnd) {
            upsertList.push({
                ...addData,
                charge_time: targetTime,
                is_plan: false,
                charge_id: uuid(),
                plan_charge_id: addData.charge_id
            })
            // 以日为周期
            if (period_type == 1) {
                targetTime += 86400000
            }
            // 以周为周期
            if (period_type == 2) {
                targetTime += 604800000
            }
            // 以月为周期
            if (period_type == 3) {
                // 基准日
                var baseTargetDate = new Date(targetTime)
                if (baseTargetDate.getMonth() === 11) break;
                // 获取下月天数
                var nextMonthDays = (new Date(year, baseTargetDate.getMonth() + 2, 0)).getDate();
                // 计算下月的日子
                var markDate = baseDate > nextMonthDays ? nextMonthDays : baseDate;
                targetTime = Date.parse(new Date(year, baseTargetDate.getMonth() + 1, markDate))
            }
            // 以季为周期
            if (period_type == 4) {
                // 基准日
                var baseTargetDate = new Date(targetTime)
                if (baseTargetDate.getMonth() === 9) break;
                // 获取下季当月天数
                var nextMonthDays = (new Date(year, baseTargetDate.getMonth() + 4, 0)).getDate();
                // 计算下季当月的日子
                var markDate = baseDate > nextMonthDays ? nextMonthDays : baseDate;
                targetTime = Date.parse(new Date(year, baseTargetDate.getMonth() + 3, markDate))
            }
            // 以年为周期
            if (period_type == 5) {
                // 默认不跨年，只记录当年数据
                targetTime += 86400000 * 366
            }
            // 周一到周五
            if (period_type == 6) {
                var baseTargetDate = new Date(targetTime)
                var baseDay = baseTargetDate.getDay();
                if (baseDay >= 1 && baseDay <= 4) {
                    targetTime += 86400000
                }
                if (baseDay == 5) {
                    targetTime += 86400000 * 3
                }
                if (baseDay == 6) {
                    targetTime += 86400000 * 2
                }
                if (baseDay == 0) {
                    targetTime += 86400000 * 1
                }
            }
            // 周六周日
            if (period_type == 7) {
                var baseTargetDate = new Date(targetTime)
                var baseDay = baseTargetDate.getDay();
                if (baseDay == 6) {
                    targetTime += 86400000
                } else {
                    targetTime += 86400000 * (6 - baseDay)
                }
            }
        }
        charge.bulkCreate(upsertList).then(bulkRes => {
            res.send({
                status: 1
            })
        }).catch(e => {
            console.log(e)
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