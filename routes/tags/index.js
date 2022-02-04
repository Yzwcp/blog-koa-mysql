const Router = require('koa-router')
const tagsRouter = new Router()
const DB = require("../../config.js")
let routesModel = {
  insertTags:(value)=>{
    let _sql = `insert into atc_tags (label,value) select ?,? from dual where not exists(select * from atc_tags where value =?)`
    return DB.query( _sql, value)
  },
  modifyTags:(value,params)=>{
    let _sql = `update atc_tags set label=?,value=? where id=${params}`
    return DB.query( _sql, value)
  },
  remove:(value,id)=>{
    let _sql = `DELETE FROM article where id='${id}'`;
    return DB.query( _sql, value)
  },
  conditionQuery: (value,params) => {
  
  }
}
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
  routesModel.conditionQuery([],value)
  let result = await routesModel.insertTags([label,value])
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
  let result = await routesModel.modifyTags([label,value],id)
  ctx.body = result;
});
/**
 * 删除标签
 */
tagsRouter.delete('/removeTags', async (ctx) => {
  const {query} = ctx.request
  const {id} = query
  let result = await routesModel.remove([],id)
  ctx.body = result;
});
module.exports = tagsRouter.routes()