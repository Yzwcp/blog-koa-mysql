const Router = require('koa-router')
const tagsRouter = new Router()
const {Tags} = require('./static.js')
const {formatResult,Tips} = require('../../util/util.js')
tagsRouter.prefix('/tags')

tagsRouter.get('/query', async (ctx) => {
  try {
    const result = await Tags.findAll()
    ctx.body = formatResult(result,true)
  }catch (e) {
    ctx.body = formatResult({},false,Tips.QUERY_ERROR)
  }
});
/***
 * 添加标签
 */
tagsRouter.post('/save', async (ctx) => {
  const {value} =ctx.request.body
  const label = value
  const [result, created] = await Tags.findOrCreate({
    where:{value},
    defaults:{ value,label }
  });
  if(created){
    ctx.body=formatResult(result,true)
  }else{
    ctx.body=formatResult({},created,`[${value}]已经存在,请重新创建`)
  }
});
/**
 * 编辑分分类
 */
tagsRouter.post('/modify', async (ctx) => {
  try {
    const {value='',id} = ctx.request.body
    if(!value || !id )return ctx.body = formatResult({},false,Tips.LACK_PARAMS)
    const label = value
    let result = await Tags.update({value,label},{ where:{id}})
    if(result.includes(1))return  ctx.body = formatResult(result,true,Tips.HANDLE_SUCCESS);
    ctx.body = formatResult(result,false,Tips.HANDLE_ERR);
  }catch (e) {
    ctx.body = formatResult({},false,e);
  }
});
/**
 * 删除标签
 * @param {Number} 标签id
 */
tagsRouter.post('/remove', async (ctx) => {
  try {
    const {id} = ctx.request.body
    if( !id )return ctx.body = formatResult({},false,Tips.LACK_PARAMS)
    let result = await Tags.destroy({ where:{id}})
    if(result>0)return  ctx.body = formatResult(result,true,Tips.HANDLE_SUCCESS);
    ctx.body = formatResult(result,false,Tips.HANDLE_ERR);
  }catch (e) {
    ctx.body = formatResult({},false,e);
  }
});
module.exports = tagsRouter.routes()
