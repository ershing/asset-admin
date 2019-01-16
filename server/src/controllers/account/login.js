const account = require('../../models/account');
const password = require('password-slow-hash');
const JwtUtil = require('../../utils/jwt');

module.exports = (req, res) => {
  let { login_name, pwd } = req.body
  if (!login_name || !pwd) {
    return res.send({
      status: 0,
      msg: '必填参数未传递'
    })
  }
  account.findOne({ where: { login_name } }).then(result => {
    //如果存在该账号
    if (result) {
      //核对密码
      password.validate(pwd, result.dataValues.pwd, function (err, isValid) {
        if (err) {
          return res.send({
            status: 0,
            msg: '密码验证失败'
          })
        }
        // 密码正确
        else if (isValid) {
          let _id = result.account_id.toString()
          let jwt = new JwtUtil(_id)
          let token = jwt.generateToken()
          return res.send({
            status: 1,
            data: token,
            msg: '验证成功'
          })
        }
        //密码不正确
        else {
          res.send({
            status: 0,
            msg: '账号不存在或密码错误'
          })
        }
      });
    }
    //如果账号不存在
    else {
      res.send({
        status: 0,
        msg: '账号不存在或密码错误'
      })
    }
  }).catch(e => {
    res.send({
      status: 0,
      msg: '数据库错误'
    })
  })
}