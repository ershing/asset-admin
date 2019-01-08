var express = require('express');
var router = express.Router();

//"name" : "验证账号信息"
router.post('/account/login',require('./controller/account/login.js'));


module.exports = router;