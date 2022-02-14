const Router = require('koa-router')
const tagsRouter = new Router()
const {tagsMoudles} = require('./static')

tagsRouter.get('/tags', async (ctx) => {
  const sql = 'select * from atc_tags';
  const result = await DB.query(sql);
  ctx.body = result
});

/***
 * 添加标签
 */
tagsRouter.get('/saveTags', async (ctx) => {
  const {query} = ctx.request
  const {value=''} = query
  const label = value
  // tagsMoudles.conditionQuery([],value)
  let result = await tagsMoudles.insert([label,value])
  ctx.body = result;
});
/**
 * 编辑分分类
 */
tagsRouter.get('/editTags', async (ctx) => {
  const {query} = ctx.request
  const {value='',id} = query
  if(!value || !id )return ctx.body = {success:false,message:'抱歉没有id或者分类名称'}
  const label = value
  let result = await tagsMoudles.modify([label,value],id)
  ctx.body = result;
});
/**
 * 删除标签
 */
tagsRouter.delete('/removeTags', async (ctx) => {
  const {query} = ctx.request
  const {id} = query
  let result = await tagsMoudles.remove([],id)
  ctx.body = result;
});
module.exports = tagsRouter.routes()
