const Router = require('koa-router')
const userRouter = new Router()
const crypto = require('crypto')
const DB = require("../../config.js")
const {util} = require('../../util')
const jwt = require('jsonwebtoken')
const {userMoudles} = require('./static')
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
  let hasUser = await userMoudles.conditionQuery([],{username})
  if (hasUser.result.length>0) return ctx.body = {success:false,message:'用户名已存在！'}
  let data = {result,success,message}  = await userMoudles.insert([username,psdMd5,createTime],username)
  const user = await userMoudles.conditionQuery([],{username})
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
  let hasUser = await userMoudles.conditionQuery([],{username})
  if (!hasUser.result.length) return ctx.body = {success:false,message:'用户名不存在！'}
  let data = {result,success,message}  = await userMoudles.login([],{username,psdMd5})
  if (!result.length) return ctx.body = {success:false,message:'密码错误！'}
  const user = await userMoudles.conditionQuery([],{username})
  const payload = {user:user.result[0]}; //存储user到token
  const token = jwt.sign(payload, util.secret, { expiresIn:  '1h' }); //过期时间
  data.token = token
  ctx.body = data
});
module.exports = userRouter.routes()
