var express = require('express');
var the_app = require("../app");
const Jwt = require('../src/service/jwt');
var mysql = require('mysql');
var DBconfig = require('../src/service/DBconfig');
var xss = require('xss');
var path=require('path');
var fs = require('fs');
var defpath=path.join(__dirname,'../');
var the_Jwt = new Jwt;
var sqlpool = the_app.sqlpool;
sqlpool = mysql.createPool(DBconfig.mysql);
var router = express.Router();
router.get('/list', function (req, res) {
    sqlpool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.status(500).json({
                errcode: 3,
                ermsg: "删除失败",
            });
            return;
        }
        var page = xss(req.query.page);
        var limit = xss(req.query.limit);
        var query_norms = 'SELECT * FROM Program_Post WHERE id > ' + connection.escape((page - 1) * limit) + ' LIMIT 20';
        connection.query(query_norms, function (err, results) {
            if (err) {
                // console.log("err"+err);
                connection.release();
                res.status(500).json({
                    errcode: 2,
                    ermsg: "查询失败",
                });
                return;
            }
            else {
                connection.query("SELECT COUNT(*) FROM Program_Post", function (err_2, results_2) {
                    if (err_2) {
                        // console.log("err"+err);
                        connection.release();
                        res.status(500).json({
                            errcode: 2,
                            ermsg: "查询失败",
                        });
                        return;
                    }
                    res.status(200).json({
                        errcode: 0,
                        ermsg: "",
                        results: results,
                        list_count: parseInt(results_2[0]["COUNT(*)"]),
                    });
                    connection.release();
                    res.end('检索成功');
                    return;
                })



            }
        });
    });
});
router.get("/Search",function(req,res){
    var prog_name = xss(req.query.prog_name);
    // console.log(prog_name)
    sqlpool.getConnection(function(err,connection){
        if (err) {
            // console.log(err)
            connection.release();
            res.status(500).json({
                errcode: 5,
                ermsg: "搜索失败",
            });
            return;
        }
        let search_query = "SELECT * FROM Program_Post WHERE name LIKE '%"+ prog_name +"%' ";
        connection.query(search_query,function(err,results){
            if (err) {
                // console.log(err)
                connection.release();
                res.status(500).json({
                    errcode: 5,
                    ermsg: "搜索失败",
                });
                return;
            }
            connection.release();
            res.status(200).json({
                errcode: 0,
                ermsg: "",
                results: results,
                list_count: parseInt(results.length),
            });
        });
    })
});

router.post("/Delete_Program", function (req, res) {
    
    var post_id = xss(req.body.post_id);
    // console.log(post_id)
    sqlpool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.status(500).json({
                errcode: 3,
                ermsg: "删除失败",
            });
            return;
        }
        let select_query = "SELECT * FROM Program_Post WHERE id = ?";
        connection.query(select_query,[post_id],function(err,results){
            if (err) {
                connection.release();
                res.status(500).json({
                    errcode: 3,
                    ermsg: "删除失败",
                });
                return;
            }
            let detail_img = results[0]["detail_img"];

            let dele_query = "DELETE FROM Program_Post WHERE id = ?";
            connection.query(dele_query,[post_id],function(err_2,results_2){
                if (err_2) {
                    connection.release();
                    res.status(500).json({
                        errcode: 3,
                        ermsg: "删除失败",
                    });
                    return;
                }else{
                    if(detail_img&&detail_img!=""){
                        let img_path = new URL(detail_img);
                        let true_img_path = img_path.pathname;
                        fs.unlink(defpath+"/public/"+true_img_path,function (err) { 
                            if (err) throw err;
                            // 如果没有错误，则文件已成功删除
                            // console.log('File deleted!'); 
                         });
                    }
                    
                    res.status(200).json({
                        errcode: 0,
                        ermsg: "",
                    });
                    connection.release();
                    return;
                }
                
            })
    });
    })
});
router.get("/Program_Detail", function (req, res) {
    var program_id = xss(req.query.program_id);
    sqlpool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.status(500).json({
                errcode: 3,
                ermsg: "查询失败",
            });
            return;
        }
        let sele_query = "SELECT * FROM Program_Post WHERE id = ?";
        connection.query(sele_query,[program_id],function(err,results){
            if (err) {
                connection.release();
                res.status(500).json({
                    errcode: 3,
                    ermsg: "查询失败",
                });
                return;
            }
                let sele_query_2 = "SELECT * FROM Program_Norm WHERE id = ?";
                connection.query(sele_query_2,[results[0]["level_index"]],function(err_2,results_2){
                    if (err_2) {
                        connection.release();
                        res.status(500).json({
                            errcode: 3,
                            ermsg: "查询失败",
                        });
                        return;
                    }
                    let program_detail_scores = results[0]["detail_scores"].split(',');
                    let norm_names = results_2[0]["name"].split(',');
                    let data_array = Array(0);
                    for (item in norm_names){
                        data_array.push({'name':norm_names[item],'score':program_detail_scores[item]});
                    }
                    connection.release();
                    res.status(200).json({
                        errcode: 0,
                        ermsg: "",
                        data_array:data_array,
                        program_data:results[0],
                    });
                    return;
                })
                
            
        })
    })
});
router.post("/Get_Score",function(req,res){
    var prog_id = xss(req.body.program_id);
    var raw_scores = xss(req.body.score);
    console.log(prog_id)
    console.log(raw_scores)
    var arr_raw_scores = raw_scores.split(",");
    sqlpool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.status(500).json({
                errcode: 5,
                ermsg: "打分失败",
            });
            return;
        }
        let select_query = "SELECT level_index FROM Program_Post WHERE id = ?";
        connection.query(select_query,[prog_id],function(err,results){
            if (err) {
                console.log(err)
                connection.release();
                res.status(500).json({
                    errcode: 3,
                    ermsg: "打分失败",
                });
                return;
            }else{
                console.log(results)
                select_query = "SELECT weight FROM Program_Norm WHERE id = ?";
                connection.query(select_query,[results[0]["level_index"]],function(err_2,results_2){
                    if (err_2) {
                        console.log(err)
                        connection.release();
                        res.status(500).json({
                            errcode: 3,
                            ermsg: "打分失败",
                        });
                        return;
                    }
                    let score_detail = results_2[0]["weight"].split(",");
                    let total_score = 0;
                    let temp_score_detail = [];
                    for(item in arr_raw_scores){
                        let temp_score = parseFloat(arr_raw_scores[item])*parseFloat(score_detail[item]);
                        total_score += temp_score;
                        temp_score_detail.push(temp_score);
                    }
                    let insert_query = "UPDATE Program_Post SET detail_scores = ?, total_score = ? WHERE id = ?";
                    connection.query(insert_query,[raw_scores.toString(),total_score,prog_id],function(err_3,results_3){
                        
                        if (err_3) {
                            console.log(err)
                            connection.release();
                            res.status(500).json({
                                errcode: 3,
                                ermsg: "打分失败",
                            });
                            return;
                        }
                        connection.release();
                        res.status(200).json({
                            errcode: 0,
                            ermsg: "",
                        });
                        return;
                    })
                    
                });
                
            }
            
        })
    })
});
router.post("/Post_Program", function (req, res) {
    var name = xss(req.body.name);
    var detail = xss(req.body.detail);
    var detail_img = xss(req.body.detail_img);
    var level_index = xss(req.body.level_index);
    sqlpool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.status(500).json({
                errcode: 5,
                ermsg: "发布失败",
            });
            return;
        }
        let insert_query = "INSERT INTO Program_Post VALUES (0,?,?,?,?,'','')";
        connection.query(insert_query,[name,detail,detail_img,level_index],function(err,results){
            if (err) {
                console.log(err)
                connection.release();
                res.status(500).json({
                    errcode: 3,
                    ermsg: "发布失败",
                });
                return;
            }else{
                connection.release();
                res.status(200).json({
                    errcode: 0,
                    ermsg: "",
                });
                return;
            }
            
        })
    })
});
function isEmptyObject(obj) {
    var name;

    for (name in obj) {
        return false;
    }
    return true;
}
module.exports = router;
