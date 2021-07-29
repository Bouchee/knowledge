// 引入模块依赖
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
// 创建 token 类
class Jwt {
    constructor(data) {
        this.data = data;
        this._id = null; // 用户自定义 存放userid
        this._date = null; // 过期时间
        this._creatDate = null; // 创建时间
    }
    // 重新生成 token
    refreshToken(old_token) {
        let cert = fs.readFileSync(__dirname+'/rsa_private_key.pem','utf-8');//私钥 可以自己生成
        let result = jwt.verify(old_token, cert, {algorithms: ['RS256']}) || {};
        let the_data = result.the_data;
        let created = Math.floor(Date.now() / 1000);
        let token = jwt.sign({
            the_data,
            exp: created + 60 * 60 *24, // 过期时间 
            iat: created, // 创建时间
        }, cert, {algorithm: 'RS256'});
        return token;
    }
    //生成token
    generateToken(data) {
        // if (data) {
        //     this.data = data;
        // }
        let the_data = data;
        let created = Math.floor(Date.now() / 1000);
        let cert = fs.readFileSync(__dirname+'/rsa_private_key.pem','utf-8');//私钥 可以自己生成
        let token = jwt.sign({
            the_data,
            exp: created + 60 * 60 *24, // 过期时间 30 分钟
            iat: created, // 创建时间
        }, cert, {algorithm: 'RS256'});
        return token;
    }

    // 校验token
    verifyToken(data) {
        if (data) {
            this.data = data;
        }
        let token = this.data;
        let cert = fs.readFileSync(__dirname+'/rsa_public_key.pem','utf-8');//公钥 可以自己生成
        let res;
        try {
            let result = jwt.verify(token, cert, {algorithms: ['RS256']}) || {};
            console.log(result);
            this._id = result.data;
            this._date = result.exp;
            this._creatDate = result.iat;
            let {exp = 0} = result, current = Math.floor(Date.now() / 1000);
            if (current <= exp) {
                res = result.data || {};
            }
        } catch (e) {
            res = 'err';
        }
        return res;
    }
}

module.exports = Jwt;
