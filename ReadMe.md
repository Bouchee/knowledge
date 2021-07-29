### 部署文档

> *项目使用LayUI / NodeJS / MySQL8*，请逐一进行环境搭建

1. 根目录下安装项目依赖 

   ```javascript
   npm install
   ```

   

2. 补全数据库信息

   > src\service\DBconfig.js 补全Mysql数据库账号密码

3. 导入数据库结构

   > 根目录下ProgramEvaluation.sql

   

4. 修改请求域名

   > 将Ajax请求接口的域名更改为服务器真实IP

   

5. 开启服务

   ```
   node app.js (默认)
   pm2 start app.js --name ProgramEvaluation(推荐使用pm2)
   ```

   

