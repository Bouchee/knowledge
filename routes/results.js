var express = require('express');
var the_app = require("../app");
const Jwt = require('../src/service/jwt');
var mysql = require('mysql');
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
                ermsg: "删除失败",
            });
            return;
        }
        var page = xss(req.query.page);
        var limit = xss(req.query.limit);
        

        var query_norms = "select e.* from Program_Post as e inner join(select d.id,max(total_score) total_score from Program_Post e left join Program_Norm d on e.level_index=d.id group by d.id) d on e.level_index=d.id and e.total_score=d.total_score";
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
                connection.query("SELECT level_index,COUNT(*) FROM Program_Post GROUP BY level_index;", function (err_2, results_2) {
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
                        list_count: parseInt(results_2.length),
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
    var prog_level = xss(req.query.prog_level);
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
        let search_query = "SELECT * FROM Program_Post WHERE level_index = ? ORDER BY total_score DESC LIMIT 1";
        connection.query(search_query,[prog_level],function(err,results){
            if (err) {
                // console.log(err)
                connection.release();
                res.status(500).json({
                    errcode: 5,
                    ermsg: "搜索失败",
                });
                return;
            }
            res.status(200).json({
                errcode: 0,
                ermsg: "",
                results: results,
                list_count: parseInt(results.length),
            });
        });
    })
});
router.get("/Detail",function(req,res){
    var prog_level = xss(req.query.prog_level);
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
        let search_query = "SELECT * FROM Program_Post WHERE level_index = ?";
        connection.query(search_query,[prog_level],function(err,results){
            if (err) {
                // console.log(err)
                connection.release();
                res.status(500).json({
                    errcode: 5,
                    ermsg: "搜索失败",
                });
                return;
            }
            search_query = "SELECT * FROM Program_Norm WHERE id = ?";
        connection.query(search_query,[prog_level],function(err_2,results_2){
            if (err_2) {
                // console.log(err)
                connection.release();
                res.status(500).json({
                    errcode: 5,
                    ermsg: "搜索失败",
                });
                return;
            }
            console.log(results_2)
            let norm_names = results_2[0]["name"].split(",");
            let norm_detail_scores = results_2[0]["weight"].split(",");
            var Prog_value = {
                x:[],
                y:[]
            };
            

            var Norm_value = [];
            for (item in norm_names){
                Norm_value.push({value:parseFloat(norm_detail_scores[item]),name:norm_names[item]})
            }
            for (item in results){
                Prog_value.x.push(results[item]['name'])
                Prog_value.y.push(parseFloat(results[item]["total_score"]))
            }
            res.status(200).json({
                errcode: 0,
                ermsg: "",
                Prog_results: results,
                Norm_results:results_2[0],
                Norm_value:Norm_value,
                Prog_value:Prog_value
            });
        });
        });
        
    })
});
router.post("/Delete_Program", function (req, res) {
    var post_id = xss(req.body.post_id);
    sqlpool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.status(500).json({
                errcode: 3,
                ermsg: "删除失败",
            });
            return;
        }
        let dele_query = "DELETE FROM Program_Post WHERE id = ?";
        connection.query(dele_query,[post_id],function(err,results){
            if (err) {
                connection.release();
                res.status(500).json({
                    errcode: 3,
                    ermsg: "删除失败",
                });
                return;
            }else{
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
