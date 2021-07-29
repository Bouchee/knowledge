var express = require('express');
var the_app = require("../app");
var multer = require('multer');
var mysql = require('mysql');
var DBconfig = require('../src/service/DBconfig');
var xss = require('xss');
var path=require('path');
var sqlpool = the_app.sqlpool;
sqlpool = mysql.createPool(DBconfig.mysql);
var router = express.Router();
var UUID = require('uuid');

var defpath=path.join(__dirname,'../');

var Post_Program_Pic_Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, defpath+"/public/static/upload/program");
    },
    filename: function (req, file, callback) {
        var file_split = file.originalname.split(".");
        var fileExtension = file_split[file_split.length - 1];
        callback(null, UUID.v1() + "." + fileExtension);
    }
});
var upload = multer({ storage: Post_Program_Pic_Storage }).array("file", 3); //Field name and max count
router.post("/Post_Program_Pic", function (req, res) {
    upload(req, res, function (err,results) {
        if (err) {
            console.log(err)
                res.status(500).json({
                    errcode: 6,
                    ermsg: "保存失败",
                });
                return;
        }
        res.status(200).json({
                errcode: 0,
                ermsg: "",
                fileUrl:'http://127.0.0.1:8081/static/upload/program/' + req.files[0].filename
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
