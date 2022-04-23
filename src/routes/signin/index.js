const Router = require('koa-router')
const SignInRouter = new Router()
const DB = require("../../connect/mysql.js")
const {SignIn} = require('./static.js')
const {User} = require('../user/static')
const {formatResult,Tips} = require('../../util/util.js')
const dayjs = require('dayjs')
const {Op} = require("../../connect/mysql.js")


SignInRouter.prefix('/wx/signIn')

SignInRouter.get('/query', async (ctx) => {
  try {
    const result = await SignIn.findAll({
      where:{articleId},
      offset: (current - 1) * pageSize,
      limit: Number(pageSize),
      order:[['id','DESC']]
    })
    ctx.body = formatResult(result,true)
  }catch (e) {
    ctx.body = formatResult(e,false,Tips.QUERY_ERROR)
  }
});
/***
 * 添加
 */
const sourceObj={
  1:{
    score:1,
    text:'签到'
  }
}
SignInRouter.post('/save', async (ctx) => {
  try {
    const {source=1} = ctx.request.body
    const nowday = dayjs(new Date()).format('YYYY/MM/DD'); // 2011-10-17 00:17:56time
    const time = new Date(nowday).getTime()
    const nowTime = new Date().getTime()
    const user = ctx.state.user
    const [signInresult, created] = await SignIn.findOrCreate({
      where: { signdate: {
        [Op.gte]:time
      } },
      defaults: {
        uid:user.id,
        source:source,
        score:sourceObj[source].score,
        signdate:nowTime
      }
    });
    console.log(created);
    if(created){
      const userResult = await User.findOne({
        where:{
          id:signInresult.uid
        }
      })
      const incrementUserResult = await userResult.increment('integral', { by:  signInresult.score});
      await incrementUserResult.reload()
      if(incrementUserResult){
        ctx.body = formatResult(incrementUserResult,true,Tips.HANDLE_SUCCESS);
      }else{
        throw '抱歉,出错； '
      }
    }else{
      throw '抱歉，今天你已经签到了'
    }
  }catch (e) {
    console.log(e);
    ctx.body = formatResult(e,false,Tips.HANDLE_ERR);
  }
});

/**
 * 删除
 */
SignInRouter.post('/remove', async (ctx) => {
  try {
    const {id} = ctx.request.body
    if( !id )return ctx.body = formatResult({},false,Tips.LACK_PARAMS)
    let result = await SignIn.destroy({ where:{id}})
    if(result>0)return  ctx.body = formatResult(result,true,Tips.HANDLE_SUCCESS);
    ctx.body = formatResult(result,false,Tips.HANDLE_ERR);
  }catch (e) {
    ctx.body = formatResult({},false,e);
  }
});
module.exports = SignInRouter.routes()
