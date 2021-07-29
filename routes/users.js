var express = require('express');
var the_app = require("../app");
// var fs = require('fs');
var mysql = require('mysql');
// var cors = require('cors');
var DBconfig = require('../src/service/DBconfig');
const Jwt = require('../src/service/jwt');
var xss = require('xss');
var the_Jwt = new Jwt;
var sqlpool = the_app.sqlpool;
sqlpool = mysql.createPool(DBconfig.mysql);
var router = express.Router();
router.post('/Login', function (req, res) {
  if (req.headers.authorization) {
    let prog_token = req.headers.authorization.split(" ")[1];
    // console.log(prog_token)
    let verify_res = the_Jwt.verifyToken(prog_token);
    if (verify_res != "err") {
      res.status(200).json({
        errcode: 0,
        errmsg: "",
        token: "Bearer " + the_Jwt.refreshToken(prog_token),
      });
      return;
    }
  }
  sqlpool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      res.status(500).json({
        errcode: 3,
        ermsg: "删除失败",
      });
      return;
    }
    var username = xss(req.body.username);
    var password = xss(req.body.password);
    // console.log(username)
    connection.query('SELECT * FROM Program_User WHERE username = ? AND password = ?', [username, password], function (err, results) {
      if (err || isEmptyObject(results)) {
        // console.log("err"+err);
        res.status(401).json({
          errcode: 1,
          errmsg: "登陆失败"
        });
        connection.release();
        return;
      }
      else {
        const token = 'Bearer ' + the_Jwt.generateToken({username:username});
        res.status(200).json({
          errcode: 0,
          errmsg: "",
          token: token
        });
        connection.release();
        return;

      }
    });
  });
});
router.post('/ifLogin', function (req, res) {
  if (req.headers.authorization) {
    let prog_token = req.headers.authorization.split(" ")[1];
    // console.log(prog_token)
    let verify_res = the_Jwt.verifyToken(prog_token);
    if (verify_res != "err") {
      res.status(200).json({
        errcode: 0,
        errmsg: "",
        token: "Bearer " + the_Jwt.refreshToken(prog_token)
      });
      return;
    } else {
      res.status(401).json({
        errcode: 1,
        errmsg: "未登录"
      });
      return;
    }
  }
});
router.post('/ChangePass', function (req, res) {
      var password = xss(req.body.password);
      var new_password = xss(req.body.new_password);
      sqlpool.getConnection(function (err, connection) {
        if (err) {
          connection.release();
          res.status(500).json({
            errcode: 4,
            ermsg: "修改失败",
          });
          return;
        }
        // console.log(req.user.the_data.username);
        var username = req.user.the_data.username;
        connection.query('UPDATE Program_User SET password = ? WHERE username = ? AND password = ?', [new_password,username, password], function (err, results) {
          if (err) {
            // console.log("err"+err);
            res.status(500).json({
              errcode: 4,
              errmsg: "修改失败"
            });
            connection.release();
            return;
          }
          else {
            res.status(200).json({
              errcode: 0,
              errmsg: "",
            });
            connection.release();
            return;
    
          }
        });
      });
});
function isEmptyObject(obj) {
  var name;

  for (name in obj) {
    return false;
  }
  return true;
}
module.exports = router;
