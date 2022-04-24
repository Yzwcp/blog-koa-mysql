const Router = require('koa-router')
const SignInRouter = new Router()
const DB = require("../../connect/mysql.js")
const {SignIn} = require('./static.js')
const {User} = require('../user/static')
const {formatResult,Tips} = require('../../util/util.js')
const dayjs = require('dayjs')
const {Op} = require("../../connect/mysql.js")


SignInRouter.prefix('/wx/signIn')

SignInRouter.post('/list', async (ctx) => {
  const m = new Date().getMonth()+1
  const y = new Date().getFullYear()
  const d = 1
  const s = y+"-"+m+'-'+d //当月第一天
  const startDate = Number(new Date(s).getTime())
  const dateEnd =  dayjs(startDate).daysInMonth() // 获取当月天数
  const end  = y+"-"+m+'-'+dateEnd//当月最后一天
  const endDate = Number(new Date(end).getTime())

  console.log(new Date("2022-4-24").getTime()-new Date("2022-4-23").getTime());
  try {
    const user = ctx.state.user
    const result = await SignIn.findAll({
      where:{
        uid:user.id,
        signdate:{
          [Op.between]: [startDate, endDate]
        }
      },
    })
    ctx.body = formatResult(result,true)
  }catch (e) {
    console.log(e);
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
    const NowTimeStamp = new Date(nowday).getTime()
    const user = ctx.state.user
    const signTimeMax = await SignIn.max('signdate', { where: {uid:user.id} });//用户最近签到时间
    // signcount
    const [signInresult, created] = await SignIn.findOrCreate({
      where: { signdate: NowTimeStamp },
      defaults: {
        uid:user.id,
        source:source,
        score:sourceObj[source].score,
        signdate:NowTimeStamp,
      }
    });
    if(created){
      const userResult = await User.findOne({
        where:{
          id:signInresult.uid
        }
      })
      //现在的时间-最近签到时间等于1天的时间戳就是连续签到
      if(signTimeMax && ( NowTimeStamp-signTimeMax == 86400000)) {
        await userResult.increment('signcount'); //连续签到自增1
      }else{
        await userResult.update({ signcount:1 })//断签设置为1
      }
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
