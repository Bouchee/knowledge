var express = require('express');
var the_app = require("../app");
const Jwt = require('../src/service/jwt');
var mysql = require('mysql');
var AHP = require('../src/service/AHP');
var DBconfig = require('../src/service/DBconfig');
var xss = require('xss');
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
                ermsg: "查询失败",
            });
            return;
        }
        var page = xss(req.query.page);
        var limit = xss(req.query.limit);
        var query_norms = 'SELECT * FROM Program_Norm WHERE id > ' + connection.escape((page - 1) * limit) + ' LIMIT 20';
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
                connection.query("SELECT COUNT(*) FROM Program_Norm", function (err_2, results_2) {
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
router.get('/List_Index', function (req, res) {
    sqlpool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.status(500).json({
                errcode: 3,
                ermsg: "查询失败",
            });
            return;
        }
        var page = xss(req.query.page);
        var limit = xss(req.query.limit);
        var query_norms = 'SELECT * FROM Program_Norm';
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
                connection.query("SELECT COUNT(*) FROM Program_Norm", function (err_2, results_2) {
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
                    return;
                })



            }
        });
    });
});
router.post("/Post_Norm", function (req, res) {
    var norm_names = xss(req.body.names);
    var norm_matrix = xss(req.body.matrix);
    
    let names_arr = norm_names.split(",");
    let matrix_arr = norm_matrix.split(",");
    
    let norm_size = names_arr.length;
    let total_size = matrix_arr.length;
    
    var data_matrix = [];
    let group_num = parseFloat(total_size / norm_size);
    for (let i = 0;i<group_num;i++){
        let temp_arr = [];
        for (let j = 0; j<norm_size;j++){
            temp_arr.push(parseFloat(matrix_arr[i*norm_size+j]));
        }
        data_matrix.push(temp_arr);
    }
    console.log(group_num);
    console.log(data_matrix);
    var weights = AHP.AHP.getWeight(data_matrix);
    console.log(weights);
    sqlpool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.status(500).json({
                errcode: 5,
                ermsg: "发布失败",
            });
            return;
        }
        let insert_query = "INSERT INTO Program_Norm VALUES (0,?,?,?)";
        connection.query(insert_query,[norm_names,norm_matrix,weights.toString()],function(err,results){
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
    
    
})

router.post("/Delete_Norm", function (req, res) {
    var norm_id = xss(req.body.norm_id);
    console.log("norm_id"+norm_id);
    sqlpool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.status(500).json({
                errcode: 3,
                ermsg: "删除失败",
            });
            return;
        }
        let dele_query = "DELETE FROM Program_Norm WHERE id = ?";
        connection.query(dele_query,[norm_id],function(err,results){
            if (err) {
                connection.release();
                res.status(500).json({
                    errcode: 3,
                    ermsg: "删除失败",
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
