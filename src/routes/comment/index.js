const Router = require('koa-router')
const commentRouter = new Router()
const DB = require("../../connect/mysql.js")
const {Comment} = require('./static.js')
const {formatResult,Tips} = require('../../util/util.js')

commentRouter.prefix('/comment')



commentRouter.get('/query', async (ctx) => {
  try {
    const {pageSize=10,current=1,articleId=null} = ctx.request.query
    if(articleId==null) throw '未找到文章'
    const result = await Comment.findAndCountAll({
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
 * 添加评论
 */
commentRouter.post('/save', async (ctx) => {
  const {articleId,likeList,nickName,parentId,type,userId,value,cEmail} = ctx.request.body
  try {
    let result = await Comment.create({articleId,likeList,nickName,parentId,type,userId,value,cEmail})
    ctx.body = formatResult(result,true,Tips.HANDLE_SUCCESS);
  }catch (e) {
    ctx.body = formatResult(e,false,Tips.HANDLE_ERR);
  }
});

/**
 * 删除评论
 */
commentRouter.post('/remove', async (ctx) => {
  try {
    const {id} = ctx.request.body
    if( !id )return ctx.body = formatResult({},false,Tips.LACK_PARAMS)
    let result = await Comment.destroy({ where:{id}})
    if(result>0)return  ctx.body = formatResult(result,true,Tips.HANDLE_SUCCESS);
    ctx.body = formatResult(result,false,Tips.HANDLE_ERR);
  }catch (e) {
    ctx.body = formatResult({},false,e);
  }
});
module.exports = commentRouter.routes()
