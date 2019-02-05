const supporterDict = [
  { code: 1, value: '现金' },
  { code: 2, value: '微信' },
  { code: 3, value: '支付宝' },
  { code: 4, value: '银行卡' },
  { code: 5, value: '股票账户' },
  { code: 6, value: '外汇账户' },
  { code: 7, value: '礼品卡类' },
]

const creditModuleDict = [
  { code: 1, value: '信用卡' },
  { code: 2, value: '花呗' },
  { code: 3, value: '京东白条' }
]

const moduleDict = [
  { code: 1, value: '口袋现金' },
  { code: 2, value: '活期存储' },
  { code: 3, value: '定期存储' },
  { code: 4, value: '电子零钱' },
  { code: 5, value: '货币基金' },
  { code: 6, value: '债券基金' },
  { code: 7, value: '混合基金' },
  { code: 8, value: '股票基金' },
  { code: 9, value: '理财产品' },
  { code: 10, value: '股票交易' },
  { code: 11, value: '期货交易' },
  { code: 12, value: '期权交易' },
  { code: 13, value: '黄金交易' },
  { code: 14, value: '石油交易' },
  { code: 15, value: '外汇交易' },
  { code: 16, value: '礼品卡类' },
]

//依赖盈利1，不能改
const earnTargetDict = [
  { code: 1, value: '盈利' },
  { code: 2, value: '工资' },
  { code: 3, value: '奖金' },
  { code: 4, value: '红包' },
  { code: 5, value: '借入' },
  { code: 6, value: '收欠款' },
]
//依赖亏损1，不能改
const spendingTargetDict = [
  { code: 1, value: '亏损' },
  { code: 2, value: '衣服' },
  { code: 3, value: '日常食品' },
  { code: 4, value: '日常用品' },
  { code: 5, value: '住宿' },
  { code: 6, value: '交通' },
  { code: 7, value: '油费' },
  { code: 8, value: '路桥费' },
  { code: 9, value: '汽车其他费用' },
  { code: 10, value: '话费' },
  { code: 11, value: '电影' },
  { code: 12, value: '聚餐' },
  { code: 13, value: '其他娱乐' },
  { code: 14, value: '零食饮料' },
  { code: 15, value: '电子设备' },
  { code: 16, value: '旅游' },
  { code: 17, value: '教育' },
  { code: 18, value: '医疗' },
  { code: 19, value: '敬老' },
  { code: 20, value: '礼品' },
  { code: 21, value: '红包' },
  { code: 22, value: '借出' },
  { code: 23, value: '还欠款' },
  { code: 24, value: '还车贷' },
  { code: 25, value: '还楼贷' },
  { code: 26, value: '还装修贷' },
]

const chargeTypeDict = [
  { code: 1, value: '收入' },
  { code: 2, value: '支出' },
  { code: 3, value: '内部转账出' },
  { code: 4, value: '内部转账入' }
]

//不能改，整个依赖
const periodTypeDict = [
  { code: 1, value: '日' },
  { code: 2, value: '周' },
  { code: 3, value: '月' },
  { code: 4, value: '季' },
  { code: 5, value: '年' },
  { code: 6, value: '周一到周五' },
  { code: 7, value: '周六周日' }
]

module.exports = {
  supporterDict,
  creditModuleDict,
  moduleDict,
  earnTargetDict,
  spendingTargetDict,
  chargeTypeDict,
  periodTypeDict
}