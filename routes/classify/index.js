const Router = require('koa-router')
const classifyRouter = new Router()
const DB = require("../../config.js")
let routesModel = {
  insertClassify:(value)=>{
    let _sql = "insert into atc_classify set label=?,value=?"
    return DB.query( _sql, value)
  },
  modifyClassify:(value,params)=>{
    let _sql = `update atc_classify set label=?,value=? where id=${params}`
    return DB.query( _sql, value)
  },
  remove:(value,id)=>{
    let _sql = `DELETE FROM atc_classify where id='${id}'`;
    return DB.query( _sql, value)
  },
}
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
  let result = await routesModel.insertClassify([label,value])
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
  let result = await routesModel.modifyClassify([label,value],id)
  ctx.body = result;
});
/**
 * 删除分类
 */
classifyRouter.delete('/removeClassify', async (ctx) => {
  const {query} = ctx.request
  const {id} = query
  let result = await routesModel.remove([],id)
  ctx.body = result;
});
module.exports = classifyRouter.routes()