const Router = require('koa-router')
const commentRouter = new Router()
const DB = require("../../config.js")
let routesModel = {
  insert:(value)=>{
    let _sql = "insert into atc_comment set articleId=?,heroInfo=?,likeList=?,myName=?,parentId=?,type=?,createTime=?,userId=?,value=?"
    return DB.query( _sql, value)
  },
  remove:(value,id)=>{
    let _sql = `DELETE FROM article where id='${id}'`;
    return DB.query( _sql, value)
  },

}
/***
 * 添加评论
 */
commentRouter.post('/saveComment', async (ctx) => {
  const {articleId, heroInfo,likeList,myName,parentId,type,userId,value} = ctx.request.body
  const createTime = new Date()
  let result = await routesModel.insert([articleId, heroInfo,likeList,myName,parentId,type,createTime,userId,value])
  ctx.body = result;
});

/**
 * 删除评论
 */
commentRouter.delete('/removeArticle', async (ctx) => {
  const {query} = ctx.request
  const {id} = query
  let result = await routesModel.remove([],id)
  ctx.body = result;
});
module.exports = commentRouter.routes()