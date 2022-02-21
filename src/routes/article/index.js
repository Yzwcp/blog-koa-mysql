const Router = require('koa-router')
const articleRouter = new Router()
const {Op} = require("../../connect/mysql.js")
const {encrypt} =require('../../authentication/hash')
const {auth,formatResult,Tips} = require('../../util/util.js')
const {Article} = require('./static.js')

articleRouter.prefix('/article')
/**
 * @api {POST} /article/query 获取文章列表
 * @apiName list
 * @apiParam {Number} pageSize 每页数据条数
 * @apiParam {Number} pageNum 第几页
 * @apiParam (可选) {String} categorize 模糊查询类别（可选）
 * @apiParam (可选) {String} title 模糊查询标题（可选）
 * @apiParam (可选) {String} tags 模糊查询标签（可选）
 * @apiSampleRequest /article/query
 * @apiGroup Article
 * @apiVersion 1.0.0
 */
articleRouter.get('/query', async (ctx) => {
  try {
    const {title,categorize,tags,pageSize=10,current=1} = ctx.request.query
    let conditions = {
      categorize:categorize,
      title:{[Op.substring]: title},// 模糊查询
      tags:{[Op.substring]: tags}
    }
    //没有条件传进来 删除查询条件
    !title && delete conditions.title
    !categorize && delete conditions.categorize
    !tags && delete conditions.tags
    const result = await Article.findAndCountAll({
      where:{...conditions},
      offset: (current - 1) * pageSize,
      limit: Number(pageSize),
      order:[['id','DESC']]
    })
    //如果有密码 不返回文章信息
    result.rows.map(item=>{
      if(item.password)  item.body = "need password"
    })
    ctx.body = formatResult(result,true)
  }catch (e) {
    ctx.body = formatResult(e,false,Tips.QUERY_ERROR)
  }
});
/***
 * 添加文章
 */
articleRouter.post('/save',auth, async (ctx) => {
  const body = ctx.request.body
  // {auth, body,categorize,title,tags,myDescribe,likeList,cover}
  // 加密文章
  if(body.password)body.password = encrypt(body.password)
  try {
    const result = await Article.create({...body})
    ctx.body = formatResult(result,true,Tips.HANDLE_SUCCESS);
  }catch (e) {
    ctx.body = formatResult(e,false,Tips.HANDLE_ERR)
  }
});
/**
 * 修改文章
 */
articleRouter.post('/modify', async (ctx) => {
  const body = ctx.request.body
  const {id} = body
  delete body.id
  //AES对称加密
  if(body.password) body.password = encrypt(body.password)
  try {
    let result = await Article.update({
      ...body
    },{
      where:{id}
    })
    if(result.includes(1))return  ctx.body = formatResult(result,true,Tips.HANDLE_SUCCESS);
    throw("查询失败")
  }catch (e) {
    ctx.body = formatResult(e,false,Tips.HANDLE_ERR)
  }
});
/**
 * 查看文章
 */
articleRouter.post('/detail', async (ctx) => {
  try {
    const body = ctx.request.body
    if( !body.id ) throw('没有id')
    const result = await Article.findOne({ where:{id:body.id}})
    if(!result) throw Tips.QUERY_ACC_ERROR
    // 文章有密码
    ctx.body = result
    if(result.password){
      if(body.password && ( encrypt(body.password) === result.password)){
        ctx.body = formatResult(result,true,Tips.HANDLE_SUCCESS);
      }else{
        throw '密码错误'
      }
    }
    ctx.body = formatResult(result,true,Tips.HANDLE_SUCCESS);
  }catch (e) {
    ctx.body = formatResult({},false,e);
  }
});
/**
 * 删除文章
 */
articleRouter.post('/remove', async (ctx) => {
  try {
    const {id} = ctx.request.body
    if( !id )return ctx.body = formatResult({},false,Tips.LACK_PARAMS)
    let result = await Article.destroy({ where:{id}})
    if(result>0)return  ctx.body = formatResult(result,true,Tips.HANDLE_SUCCESS);
    throw "查询失败"
  }catch (e) {
    ctx.body = formatResult(e,false,e);
  }
});

module.exports = articleRouter.routes()
