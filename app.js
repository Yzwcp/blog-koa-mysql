

const Koa = require('koa')
const koaJwt = require('koa-jwt');
const jwt = require('jsonwebtoken')
const app =new Koa()
const logger = require('koa-logger')
const {verifyToken} =require('./src/authentication/token.js')

// app.use(async (ctx, next) => {
//   //取出来源 来源为admin请求的需要token校验
//   try {
//     const { authorization = null } = ctx.request.header
//     if(authorization===null) throw({message:'未携带token'})
//     const token = authorization.replace('Bearer ', '')
//     verifyToken(token).then(async()=>{
//       await next()
//     }).catch((e)=>{
//       throw e
//     })
//   } catch (e) {
//     ctx.throw(401, e.message)
//   }
// });
// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

const router =  require('./src/index.js')
const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')
app.use(cors())
app.use(logger())
app.use(bodyParser())
app.use(router.routes());//启动路由
app.use(router.allowedMethods()); // 作用： 这是官方文档的推荐用法,我们可以看到router.allowedMethods()用在了路由匹配router.routes()之后,所以在当所有路由中间件最后调用.此时根据ctx.status设置response响应头
app.listen(3000)
console.log('[demo] start-quick is starting at port 3000')
