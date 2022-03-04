

const Koa = require('koa')
const app =new Koa()
const logger = require('koa-logger')
const {verifyToken} =require('./src/authentication/token.js')
const router =  require('./src/index.js')
const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')
const wihteList = ['login','query','detail','register']
  const server = require('http').Server(app.callback())
const io = require('socket.io')(server)

app.use(cors())
// logger
app.use( async (ctx, next) => {
  //取出来源 来源为admin请求的需要token校验
  await next()
return

  let is = wihteList.filter(item=>{
    return(ctx.request.path.indexOf(item)>-1)

  })
  if(is.length>0 && ctx.request.path.indexOf('admin')<1)return  await next()
  try {
    const { authorization = null } = ctx.request.header
    if(!authorization) throw '未携带token'
    const token = authorization.replace('Bearer ', '')
    const {success,result,message} =  await verifyToken(token)
    if(!success) throw message
    ctx.state.auth=result.auth;
    await next()
  } catch (e) {
    ctx.throw(401, e)
  }
});
app.use(logger())
app.use(bodyParser())
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
app.use(router.routes());//启动路由
app.use(router.allowedMethods()); // 作用： 这是官方文档的推荐用法,我们可以看到router.allowedMethods()用在了路由匹配router.routes()之后,所以在当所有路由中间件最后调用.此时根据ctx.status设置response响应头
io.on('connection', socket => {
  console.log('初始化成功！下面可以用socket绑定事件和触发事件了');
  socket.on('send', data => {
    console.log('客户端发送的内容：', data);
    socket.emit('getMsg', '我是返回的消息... ...');
  })

  setTimeout( () => {
    socket.emit('getMsg', '我是初始化3s后的返回消息... ...')
  }, 3000)
})

server.listen(3030)
console.log('[demo] start-quick is starting at port 3030')
