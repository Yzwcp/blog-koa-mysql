const Router = require('koa-router')
const commonRouter = new Router()
const DB = require("../../config.js")
const {util,client} = require('../../util')

const jwt = require('koa-jwt')({secret:'umep_app_secret'});
let routesModel = {
  commonQuery:(value,dbName,where="",orderBy,limit) => {
    const sql = `select * from ${dbName} ${where} order by ${orderBy} limit ${limit}`;
    return  DB.query(sql,value);
  },
  /**
   * 点赞 喜欢
   * @param value
   * @param dbName
   * @param userLikeMd5 用户的md5  浏览器类型+id
   * @param where
   * @returns {Promise<unknown>}
   */
  guestList:(value,dbName,userLikeMd5,where)=>{
    let _sql = 'update '+dbName+' set likeList = concat(likeList,'+'"'+userLikeMd5+',"'+') '+where+''
    return DB.query( _sql, value)
  },
  countQuery:(value,dbName,where)=>{
    const sql = `select   count(*)   as   total   from   ${dbName}  ${where}`;
    return  DB.query(sql,value);
  },
}
/***
 * 评论喜欢
 */
commonRouter.post('/saveCommonLike', async (ctx) => {
  const {where,userLikeMd5,dbName} = ctx.request.body
  if(where) wo="where "+ where
  let result = await routesModel.guestList([],dbName,userLikeMd5,wo)

  ctx.body = result;
});
/**
 * 通用查询接口
 */
commonRouter.get('/query',util.auth, async (ctx) => {
  const {query} = ctx.request
  const {dbName,where="",orderBy="Id",limit="0,10"} = query
  let wo = ''
  if(where) wo="where "+ where
  const count  = await routesModel.countQuery([],dbName,wo)
  const result = await routesModel.commonQuery([],dbName,wo,orderBy,limit)
  if(count.success) result.total = count.result[0].total//总记录数
  ctx.body = result
});

commonRouter.get('/imageList',async (ctx)=>{
  try {
    let result = await client.list({
      'max-keys': 5
    })
    console.log(result)
    ctx.body={
      result
    }
  } catch (err) {
    console.log (err)
  }
})
module.exports = commonRouter.routes()
