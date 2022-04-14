const Router = require('koa-router')
const userRouter = new Router()
const {User} = require('./static.js')
const {encrypt} =require('../../authentication/hash')
const {setToken} =require('../../authentication/token.js')
const {formatResult,Tips} = require('../../util/util.js')
const {wxConfig} = require('../../connect/wx')
const koa2Req = require('koa2-request')

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


userRouter.post('/wx/login', async (ctx) => {
  try {
    const {js_code='',userInfo=''} = ctx.request.body
    //去微信拿openid
    const thirdpartyResult =await koa2Req({url:`https://api.weixin.qq.com/sns/jscode2session?appid=${wxConfig.appid}&secret=${wxConfig.secret}&js_code=${js_code}&grant_type=authorization_code`})
    if(thirdpartyResult.statusCode===200){
      const wxresult = JSON.parse(JSON.parse(JSON.stringify(thirdpartyResult.body)))
      const [result, created] = await User.findOrCreate({
        where:{
          openid:wxresult.openid
        },
        defaults:{ userInfo,auth:'wx'}
      });
      const token =await setToken({id:result.id,auth:result.auth,openid:result.openid},'3600d')
      ctx.body=formatResult({result:result.userInfo,token},true)
    }
    // return
    // const result = await User.findOne({where:{email}})
    // if(!result) throw('邮箱不存在')
    // if(result.password !== encrypt(password))throw('密码错误')
    // const token =await setToken({id:result.id,auth:result.auth,email:result.email},)
    // ctx.body=formatResult(result,true,token)
  }catch (e) {
    ctx.body = formatResult(e,false,Tips.HANDLE_ERR)
  }
});
module.exports = userRouter.routes()
