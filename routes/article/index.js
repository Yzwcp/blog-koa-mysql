const Router = require('koa-router')
const articleRouter = new Router()
const DB = require("../../config.js")
let routesModel = {
  insertAticle:(value)=>{
    let _sql = "insert into article set auth=?,body=?,categorize=?,title=?,tags=?,myDescribe=?,cover=?,likeList=?,createTime=?,updateTime=?;"
    return DB.query( _sql, value)
  },
  modifyArticle:(value,Id)=>{
    let _sql = `update article set auth=?,body=?,categorize=?,title=?,tags=?,myDescribe=?,cover=?,updateTime=? where Id=${Id}`
    return DB.query( _sql, value)
  },
  remove:(value,id)=>{
    let _sql = `DELETE FROM article where id='${id}'`;
    return DB.query( _sql, value)
  },
}
articleRouter.get('/article', async (ctx) => {
  const sql = 'select * from article';
  const result = await DB.query(sql);
  ctx.body = result
});

/***
 * 添加文章
 */
articleRouter.post('/saveArticle', async (ctx) => {
  const {auth, body,categorize,title,tags,myDescribe,likeList,cover} = ctx.request.body
  const createTime = new Date()
  const updateTime = createTime
  let result = await routesModel.insertAticle([auth, body,categorize,title,tags,myDescribe,cover,likeList,createTime,updateTime])
  ctx.body = result;
});
/**
 * 修改文章
 */
articleRouter.post('/editArticle', async (ctx) => {
  const {auth, body,categorize,title,tags,myDescribe,Id,cover} = ctx.request.body
  const updateTime = new Date()
  let result = await routesModel.modifyArticle([auth, body,categorize,title,tags,myDescribe,cover,updateTime],Id)
  ctx.body = result;
});
/**
 * 删除文章
 */
articleRouter.delete('/removeArticle', async (ctx) => {
  const {query} = ctx.request
  const {id} = query
  let result = await routesModel.remove([],id)
  ctx.body = result;
});
module.exports = articleRouter.routes()