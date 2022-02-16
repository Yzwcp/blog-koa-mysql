const Router = require('koa-router')
const userRouter = new Router()
const {User} = require('./static.js')
const {encrypt} =require('../../authentication/hash')
const {setToken} =require('../../authentication/token.js')
const {formatResult,Tips} = require('../../util/util.js')

/***
 * 注册用户
 */
userRouter.post('/register', async (ctx) => {
  const {nickName='',password='',email,phone} = ctx.request.body
  const [result, created] = await User.findOrCreate({
    where:{
      email
    },
    defaults:{ email,nickName,password:encrypt(password),auth:1}
  });
  if(created){
     const token =await setToken({id:result.id,auth:result.auth,email:result.email},)
    ctx.body=formatResult({token},true)
  }else{
    ctx.body=formatResult({},created,`${email}已经存在,请重新创建`)
  }
});
userRouter.post('/login', async (ctx) => {
  try {
    const {email='',password=''} = ctx.request.body
    const result = await User.findOne({where:{email}})
    if(!result) throw('邮箱不存在')
    if(result.password !== encrypt(password))throw('密码错误')
    const token =await setToken({id:result.id,auth:result.auth,email:result.email},)
    ctx.body=formatResult(result,true,token)
  }catch (e) {
    ctx.body = formatResult(e,false,Tips.HANDLE_ERR)
  }
});
module.exports = userRouter.routes()
