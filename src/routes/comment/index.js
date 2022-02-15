const Router = require('koa-router')
const commentRouter = new Router()
const DB = require("../../connect/mysql.js")
const {commonMoudles} = require('./static.js')
/***
 * 添加评论
 */
commentRouter.post('/saveComment', async (ctx) => {
  const {articleId, heroInfo,likeList,myName,parentId,type,userId,value} = ctx.request.body
  const createTime = new Date()
  let result = await commonMoudles.insert([articleId, heroInfo,likeList,myName,parentId,type,createTime,userId,value])
  ctx.body = result;
});

/**
 * 删除评论
 */
commentRouter.delete('/removeArticle', async (ctx) => {
  const {query} = ctx.request
  const {id} = query
  let result = await commonMoudles.remove([],id)
  ctx.body = result;
});
module.exports = commentRouter.routes()
