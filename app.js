

const Koa = require('koa')
const koaJwt = require('koa-jwt');
const jwt = require('jsonwebtoken')
const app =new Koa()
const logger = require('koa-logger')

app.use(koaJwt({ secret: 'umep_app_secret' }).unless({
  // 登录接口不需要验证
  path: [/^\/query/,/^\/register/,/^\/login/,/^\/imageList/,/^\/upload/]
}));
app.use(async (ctx, next) => {
  return next().catch((err) => {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        message:err.message
      }
    } else {
      throw err;
    }
  })
});

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

const router =  require('./routes/index')
const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')
app.use(cors())
app.use(logger())
app.use(bodyParser())
app.use(router.routes());//启动路由
app.use(router.allowedMethods()); // 作用： 这是官方文档的推荐用法,我们可以看到router.allowedMethods()用在了路由匹配router.routes()之后,所以在当所有路由中间件最后调用.此时根据ctx.status设置response响应头
app.listen(3000)
console.log('[demo] start-quick is starting at port 3000')
