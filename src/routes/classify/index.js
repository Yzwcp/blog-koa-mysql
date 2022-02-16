const Router = require('koa-router')
const categorize = new Router()
const {Categorize} = require('./static.js')
const {formatResult,Tips} = require('../../util/util.js')
categorize.prefix('/categorize')

categorize.get('/query', async (ctx) => {
  try {
    const result = await Categorize.findAndCountAll()
    ctx.body = formatResult(result,true)
  }catch (e) {
    console.log(e);
    ctx.body = formatResult(e,false,Tips.QUERY_ERROR)
  }
});
/***
 * 添加分类
 */
categorize.post('/save', async (ctx) => {
  const {value} =ctx.request.body
  const label = value
  const [result, created] = await Categorize.findOrCreate({
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
categorize.post('/modify', async (ctx) => {
  try {
    const {value='',id} = ctx.request.body
    if(!value || !id )return ctx.body = formatResult({},false,Tips.LACK_PARAMS)
    const label = value
    let result = await Categorize.update({value,label},{ where:{id}})
    if(result.includes(1))return  ctx.body = formatResult(result,true,Tips.HANDLE_SUCCESS);
    ctx.body = formatResult(result,false,Tips.HANDLE_ERR);
  }catch (e) {
    ctx.body = formatResult({},false,e);
  }
});
/**
 * 删除分类
 * @param {Number} 分类
 */
categorize.post('/remove', async (ctx) => {
  try {
    const {id} = ctx.request.body
    if( !id )return ctx.body = formatResult({},false,Tips.LACK_PARAMS)
    let result = await Categorize.destroy({ where:{id}})
    if(result>0)return  ctx.body = formatResult(result,true,Tips.HANDLE_SUCCESS);
    ctx.body = formatResult(result,false,Tips.HANDLE_ERR);
  }catch (e) {
    ctx.body = formatResult({},false,e);
  }
});
module.exports = categorize.routes()
