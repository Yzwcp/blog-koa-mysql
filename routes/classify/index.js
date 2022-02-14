const Router = require('koa-router')
const classifyRouter = new Router()
const DB = require("../../config.js")
const {classifyMoudles} = require('./static')
classifyRouter.get('/classify', async (ctx) => {
  const sql = 'select * from atc_classify';
  const result = await DB.query(sql);
  ctx.body = result
});

/***
 * 添加分类
 */
classifyRouter.get('/saveClassify', async (ctx) => {
  const {query} = ctx.request
  const {value=''} = query
  const label = value
  let result = await classifyMoudles.insert([label,value])
  ctx.body = result;
});
/**
 * 修改分类
 */
classifyRouter.get('/editClassify', async (ctx) => {
  const {query} = ctx.request
  const {value='',id} = query
  if(!value || !id )return ctx.body = {success:false,message:'抱歉没有id或者分类名称'}
  const label = value
  let result = await classifyMoudles.modify([label,value],id)
  ctx.body = result;
});
/**
 * 删除分类
 */
classifyRouter.delete('/removeClassify', async (ctx) => {
  const {query} = ctx.request
  const {id} = query
  let result = await classifyMoudles.remove([],id)
  ctx.body = result;
});
module.exports = classifyRouter.routes()
