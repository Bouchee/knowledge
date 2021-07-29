var express = require('express');
var http = require('http');
// var https = require('https');
var fs = require('fs');
var mysql = require('mysql');

var cors = require('cors');
var usersRouter = require('./routes/users');
var normsRouter = require('./routes/norms');
var resultsRouter = require('./routes/results');
var programsRouter = require('./routes/programs');
var filesRouter = require('./routes/files');
var cookieParser = require('cookie-parser');
const expressJWT = require('express-jwt');
var bodyParser= require('body-parser');
var DBconfig = require('./src/service/DBconfig');
var sqlpool = mysql.createPool(DBconfig.mysql);
var app = express();
// var httpsServer = https.createServer(options,app);
// var httpServer = http.createServer(app);

app.use(cookieParser('#12Ac_'));
app.use(bodyParser.json());
//app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors({credentials: true,
   "origin": "*",
   "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
   "Access-Control-Allow-Origin":"*",
   "preflightContinue": false,
   "optionsSuccessStatus": 204,
   exposedHeaders:["Authorization"]
}));

app.use(express.static(__dirname+"/public",{index:"index.html"}));//默认设置首页
//app.use(expressJWT({
//   secret: fs.readFileSync(__dirname+'/src/service/rsa_public_key.pem','utf-8'),  // 签名的密钥 或 PublicKey
//   algorithms: ['RS256']
// }).unless({
//   path: [
//   { url: /^\/\/.*/, methods: ['GET'] },
//   { url:"/static/upload/program/", methods: ['GET'] },
//  '/favicon.ico',
//   '/users/Login',  
//   '/users/ifLogin',
//  '/static/upload/program/*.*' ]  // 指定路径不经过 Token 解析
// }));
 app.use('/users',usersRouter);
 app.use('/norms',normsRouter);
 app.use('/results',resultsRouter);
 app.use('/programs',programsRouter);
 app.use('/files',filesRouter);


//  主页输出 "Hello World"
// app.get('/SignUp.html', function (req, res) {
//    if(req.session.user_id){
//       // res.write();
//       console.log(req.session.user_id+" already Login!");
//       res.status(204).end(req.session.userid+" already Login!");
//       return;
//   }
//   else{   
//           if(req.signedCookies["UserId"]){
//               req.session.user_id = req.signedCookies["UserId"];
//               console.log(req.session.user_id+" already Login!");
//               res.status(204).end(req.session.user_id+" already Login!");
//               return;
//           }
//           else{

//           }
//       }
// });
// function rdata(fileName,res){
//    fs.readFile(fileName,(err,data)=>{
//            if(err){
//                    res.writeHead(200,{"content-type":"text/html;charset=utf8"});
//                    res.write("<h1>404 Error</h1>");
//                    res.end("<p>找不到此网页！</p>")
//            }
//            else{
//                    res.writeHead(200,{"content-type":"text/html;charset=utf8"});
//                    res.end(data);
//            }
//    })
// }
function isEmptyObject( obj ) {
   var name;

   for ( name in obj ) {
       return false;
   }
   return true;
}

//https监听8082端口
// httpsServer.listen(8360,'0.0.0.0');
//http监听8081端口
// httpServer.listen(8081,'0.0.0.0');
app.listen(8081,'0.0.0.0');
module.exports = {
    the_app:{
        app:app,
        sqlpool:sqlpool,
    }
}
