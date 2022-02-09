const Router = require('koa-router')
const userRouter = new Router()
const crypto = require('crypto')
const DB = require("../../config.js")
const {util} = require('../../util')
const jwt = require('jsonwebtoken')
let routesModel = {
  insert:(value,username)=>{
    let _sql = `insert into user (username,password) select ?,? from dual where not exists(select * from user where username = `+"'"+username+"'"+')'
    return DB.query( _sql, value)
  },
  login:(value,params)=>{
    let _sql = `select * from user where username = '${params.username}' and password='${params.psdMd5}'`
    return DB.query( _sql, value)
  },
  remove:(value,id)=>{
    let _sql = `DELETE FROM article where id='${id}'`;
    return DB.query( _sql, value)
  },
  conditionQuery: (value,params) => {
    let _sql = `select * from user where username = '${params.username}' `
    return DB.query( _sql, value)
  }
}
/***
 * 注册用户
 */
userRouter.post('/register', async (ctx) => {
  const {username='',password=''} = ctx.request.body
  const psdMd5 = crypto
  .createHash('md5')
  .update(password)
  .digest('hex');
  const createTime = new Date()
  let hasUser = await routesModel.conditionQuery([],{username})
  if (hasUser.result.length>0) return ctx.body = {success:false,message:'用户名已存在！'}
  let data = {result,success,message}  = await routesModel.insert([username,psdMd5,createTime],username)
  const user = await routesModel.conditionQuery([],{username})
  const payload = {user:user.result[0]}; //存储user到token
  const token = jwt.sign(payload, util.secret, { expiresIn:  '1h' }); //过期时间
  data.token = token
  ctx.body = data
});
userRouter.post('/login', async (ctx) => {
  const {username='',password=''} = ctx.request.body
  const psdMd5 = crypto
  .createHash('md5')
  .update(password)
  .digest('hex');
  let hasUser = await routesModel.conditionQuery([],{username})
  if (!hasUser.result.length) return ctx.body = {success:false,message:'用户名不存在！'}
  let data = {result,success,message}  = await routesModel.login([],{username,psdMd5})
  if (!result.length) return ctx.body = {success:false,message:'密码错误！'}
  const user = await routesModel.conditionQuery([],{username})
  const payload = {user:user.result[0]}; //存储user到token
  const token = jwt.sign(payload, util.secret, { expiresIn:  '1h' }); //过期时间
  data.token = token
  ctx.body = data
});
module.exports = userRouter.routes()
