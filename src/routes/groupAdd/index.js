const Router = require('koa-router')
const groupAddRouter = new Router()
const {Op} = require("../../connect/mysql.js")
const {encrypt} =require('../../authentication/hash')
const {auth,formatResult,Tips} = require('../../util/util.js')
const {GroupAdd} = require('./static.js')
const {Bulk} = require('../bulk/static')
const {Order} = require('../order/static')

groupAddRouter.prefix('/wx/group')
/**
 * @api {POST} /article/query 获取拼团列表
 * @apiName list
 * @apiParam {Number} pageSize 每页数据条数
 * @apiParam {Number} pageNum 第几页
 * @apiParam (可选) {String} categorize 模糊查询类别（可选）
 * @apiParam (可选) {String} title 模糊查询标题（可选）
 * @apiParam (可选) {String} tags 模糊查询标签（可选）
 * @apiSampleRequest /article/query
 * @apiGroup GroupAdd
 * @apiVersion 1.0.0
 */
groupAddRouter.get('/query', async (ctx) => {
  try {
    const {title,categorize,tags,pageSize=10,current=1} = ctx.request.query
    let conditions = {
      // categorize:categorize,
      // title:{[Op.substring]: title},// 模糊查询
      // tags:{[Op.substring]: tags},
      // private:true
    }
    
  GroupAdd.belongsTo(Bulk, { foreignKey: 'bulk_id', targetKey: 'id' });
    //没有条件传进来 删除查询条件
    // !title && delete conditions.title
    // !categorize && delete conditions.categorize
    // !tags && delete conditions.tags
    // GroupAdd.belongsTo(Bulk, { foreignKey: 'bulk_id', targetKey: 'id' });
    const result = await GroupAdd.findAndCountAll({
      where:{...conditions},
      include:[Bulk],
      offset: (current - 1) * pageSize,
      limit: Number(pageSize),
      order:[['id','DESC']]
    })

    ctx.body = formatResult(result,true)
  }catch (e) {
    ctx.body = formatResult(e,false,Tips.QUERY_ERROR)
  }
});
/***
 * 添加拼团
 */
groupAddRouter.post('/save', async (ctx) => {
  const body = ctx.request.body
  const {bulk_id,order_id} = body
  const nowTimeStamp = Number(new Date().getTime() )
  const user = ctx.state.user
  // 先查询下本活动有木有被该人帮助过
  try {
    const groupAddResult = await GroupAdd.findOne({
      where:{
        openid:user.openid,
        bulk_id:bulk_id,
        order_id:order_id,
        uid:user.id
      }
    })
    if(groupAddResult){
      throw '您已经帮助过他了'  
    }

    //查询订单结束时间
    const orderdetail = await Order.findOne({
      where:{
        id:order_id,
        endtime:{[Op.lte]:nowTimeStamp,},

      }
    })
    if(orderdetail) throw '订单已经过期'  
    
    //查询订单关联的商品结束时间
    // const bulkdetail = await Bulk.findOne({ where:{id:bulk_id,endtime:{[Op.lte]:nowTimeStamp,}}})
    // if(bulkdetail) throw '活动已经过期'

    const result = await GroupAdd.create({
      ...body,
      uid:user.id,
      startime:nowTimeStamp,
      openid:user.openid,
      parent:0,
    })
    ctx.body = formatResult(result,true,Tips.HANDLE_SUCCESS);
  }catch (e) {
    console.log(e);
    ctx.body = formatResult(e,false,Tips.HANDLE_ERR)
  }
});
/**
 * 修改拼团
 */
groupAddRouter.post('/modify', async (ctx) => {
  const body = {...ctx.request.body}
  const {id,} = body
  delete body.id
  //AES对称加密
  try {
    let result = await GroupAdd.update({
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
 * 查看拼团
 */
groupAddRouter.post('/detail', async (ctx) => {
  try {
    const body = ctx.request.body
    if( !body.id ) throw('没有id')
    const orderesult = await GroupAdd.findOne({ where:{id:body.id}})
    const bulkresult = await Bulk.findOne({ where:{id:orderesult.bulk_id}})

    ctx.body = formatResult({orderesult,bulkresult},true,Tips.HANDLE_SUCCESS);
  }catch (e) {
    ctx.body = formatResult({},false,e);
  }
});
/**
 * 删除拼团
 */
groupAddRouter.post('/remove', async (ctx) => {
  try {
    const {id} = ctx.request.body
    console.log(id);
    if( !id )return ctx.body = formatResult({},false,Tips.LACK_PARAMS)
    let result = await GroupAdd.destroy({ where:{id}})
    if(result>0)return  ctx.body = formatResult(result,true,Tips.HANDLE_SUCCESS);
    throw "查询失败"
  }catch (e) {
    ctx.body = formatResult(e,false,e);
  }
});
// admin

/**
 * @api {POST} /article/query 获取拼团列表
 * @apiName list
 * @apiParam {Number} pageSize 每页数据条数
 * @apiParam {Number} pageNum 第几页
 * @apiParam (可选) {String} categorize 模糊查询类别（可选）
 * @apiParam (可选) {String} title 模糊查询标题（可选）
 * @apiParam (可选) {String} tags 模糊查询标签（可选）
 * @apiSampleRequest /article/query
 * @apiGroup GroupAdd
 * @apiVersion 1.0.0
 */
groupAddRouter.get('/admin/query', async (ctx) => {
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
    const result = await GroupAdd.findAndCountAll({
      where:{...conditions},
      offset: (current - 1) * pageSize,
      limit: Number(pageSize),
      order:[['id','DESC']]
    })
    //如果有密码 不返回拼团信息 管理员除外
    console.log(ctx.state.auth)
    if(ctx.state.auth != 100){
      result.rows.map(item=>{
        if(item.password)  item.body = "need password"
      })
    }
    ctx.body = formatResult(result,true)
  }catch (e) {
    ctx.body = formatResult(e,false,Tips.QUERY_ERROR)
  }
});
module.exports = groupAddRouter.routes()
