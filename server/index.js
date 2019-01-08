var express = require('express');
var bodyParser = require('body-parser');
app = express();

app.use(function(req,res,next){
     res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers':['Content-Type']
    })
    next();
})

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(require('./src/router.js'));

app.use(function (err, req, res, next) {
    // 带有四个参数的 middleware 专门用来处理异常
    var resObj = {
      desc: "系统错误" + err.message
    };
    res.status(500).send(resObj);
});

var tmport = 6688;
var server = app.listen(tmport);

server.on('listening', function () { 
    console.log(`******asset-admin服务器在端口【 %d 】监听******`, server.address().port)
})
server.on("close", function () {
    console.log(`******asset-admin服务器在端口【 %d 】正在停止监听******`, server.address().port)
})



