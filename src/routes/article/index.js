const Router = require('koa-router')
const articleRouter = new Router()
const DB = require("../../connect/mysql.js")
const {auth} = require('../../util/util.js')
const {articleMoudles} = require('./static.js')

articleRouter.get('/article', async (ctx) => {
  const sql = 'select * from article';
  const result = await DB.query(sql);
  ctx.body = result
});
/***
 * 添加文章
 */
articleRouter.post('/saveArticle',auth, async (ctx) => {
  const {auth, body,categorize,title,tags,myDescribe,likeList,cover} = ctx.request.body
  const createTime = new Date()
  const updateTime = createTime
  let result = await articleMoudles.insert([auth, body,categorize,title,tags,myDescribe,cover,likeList,createTime,updateTime])
  ctx.body = result;
});
/**
 * 修改文章
 */
articleRouter.post('/editArticle', async (ctx) => {
  const {auth, body,categorize,title,tags,myDescribe,Id,cover} = ctx.request.body
  const updateTime = new Date()
  let result = await articleMoudles.modify([auth, body,categorize,title,tags,myDescribe,cover,updateTime],Id)
  ctx.body = result;
});
/**
 * 删除文章
 */
articleRouter.delete('/removeArticle', async (ctx) => {
  const {query} = ctx.request
  const {id} = query
  let result = await articleMoudles.remove([],id)
  ctx.body = result;
});
// function verifyToken(ctx,next) {
//   const bearerHeader = ctx.request.headers['authorization'];
//   console.log(bearerHeader)
//   if(typeof bearerHeader !== 'undefined') {
//     const bearer = bearerHeader.split(' ');
//     const bearerToken = bearer[1];
//     ctx.state.token = bearerToken;
//     next();
//   } else {
//     ctx.body = {
//       code: 401,
//       msg:" err.message"
//     }
//   }
// }
module.exports = articleRouter.routes()
