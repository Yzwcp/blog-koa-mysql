const Router = require('koa-router')
const userRouter = new Router()
const crypto = require('crypto')
const DB = require("../../config.js")
const util = require('../../util')
const jwt = require('jsonwebtoken')
let routesModel = {
  insert:(value,username)=>{
    let _sql = `insert into user (username,password) select ?,? from dual where not exists(select * from user where username = `+"'"+username+"'"+')'
    return DB.query( _sql, value)
  },
  modify:(value,params)=>{
    let _sql = `update atc_tags set label=?,value=? where id=${params}`
    return DB.query( _sql, value)
  },
  remove:(value,id)=>{
    let _sql = `DELETE FROM article where id='${id}'`;
    return DB.query( _sql, value)
  },
  conditionQuery: (value,params) => {
  
  }
}
/***
 * 注册用户
 */
userRouter.post('/saveUser', async (ctx) => {
  const {username='',password=''} = ctx.request.body
  const psdMd5 = crypto
  .createHash('md5')
  .update(password)
  .digest('hex');
  const secret = 'umep_app_secret';
  const createTime = new Date()
  let data = {result,success,message}  = await routesModel.insert([username,psdMd5,createTime],username)
  if(!success) return ctx.body = {...data,message:"用户已经存在了"} //修改失败
  const payload = {username,password,Id:result.insertId};
  const token = jwt.sign(payload, secret, { expiresIn:  '1m' }); //过期时间
  data.token = token
  ctx.body = data
});
userRouter.post('/login', async (ctx) => {
  const {username='',password=''} = ctx.request.body
  const psdMd5 = crypto
  .createHash('md5')
  .update(password)
  .digest('hex');
  const secret = 'umep_app_secret';
  const createTime = new Date()
  let data = {result,success,message}  = await routesModel.modify([username,psdMd5])
  if(!success) return ctx.body = {...data,message:"用户已经存在了"} //修改失败
  const payload = {username,password,Id:result.insertId};
  const token = jwt.sign(payload, secret, { expiresIn:  '1m' }); //过期时间
  data.token = token
  ctx.body = data
});
module.exports = userRouter.routes()