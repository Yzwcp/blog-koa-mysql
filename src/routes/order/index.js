const Router = require('koa-router')
const orderRouter = new Router()
const {Op} = require("../../connect/mysql.js")
const {encrypt} =require('../../authentication/hash')
const {auth,formatResult,Tips} = require('../../util/util.js')
const {Order} = require('./static.js')
const {Bulk} = require('../bulk/static')
const {GroupAdd} = require('../groupAdd/static')

orderRouter.prefix('/wx/order')
/**
 * @api {POST} /article/query 获取拼团列表
 * @apiName list
 * @apiParam {Number} pageSize 每页数据条数
 * @apiParam {Number} pageNum 第几页
 * @apiParam (可选) {String} categorize 模糊查询类别（可选）
 * @apiParam (可选) {String} title 模糊查询标题（可选）
 * @apiParam (可选) {String} tags 模糊查询标签（可选）
 * @apiSampleRequest /article/query
 * @apiGroup Order
 * @apiVersion 1.0.0
 */
orderRouter.get('/query', async (ctx) => {
  try {
    const {title,categorize,tags,pageSize=10,current=1} = ctx.request.query
    let conditions = {
      // categorize:categorize,
      // title:{[Op.substring]: title},// 模糊查询
      // tags:{[Op.substring]: tags},
      // private:true
    }
    
  Order.belongsTo(Bulk, { foreignKey: 'bulk_id', targetKey: 'id' });
    //没有条件传进来 删除查询条件
    // !title && delete conditions.title
    // !categorize && delete conditions.categorize
    // !tags && delete conditions.tags
    // Order.belongsTo(Bulk, { foreignKey: 'bulk_id', targetKey: 'id' });
    const result = await Order.findAndCountAll({
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
orderRouter.post('/save', async (ctx) => {
  const body = ctx.request.body
  // {auth, body,categorize,title,tags,myDescribe,likeList,cover}
  // 加密拼团
  const {bulkId} = body
  const nowTimeStamp = Number(new Date().getTime() )

  const user = ctx.state.user
  try {
    //查询是否已经创建过该商品的拼团
    const orderResult = await Order.findOne({
      where:{
        openid:user.openid,
        bulk_id:bulkId,
        endtime:{
          [Op.gte]:nowTimeStamp,   
        }
      }
    })
    if(orderResult){
      ctx.body = formatResult({id:orderResult.id},false,Tips.HANDLE_WX_HASRECORD);
      return
    }
    //查询订单关联的商品
    const bulkdetail = await Bulk.findOne({ where:{id:bulkId}})
    const towdaylater = nowTimeStamp+ 48 * 60 * 60 * 1000//俩天后过期
    const endingTimeStamp = new Date(bulkdetail.endtime).getTime()
    const c = endingTimeStamp-nowTimeStamp
  
    if(c<=0) throw '活动过期'
    const result = await Order.create({
      endtime:towdaylater,
      bulk_id:bulkId,
      openid:ctx.state.user.openid,
      creator:ctx.state.user.openid,
    })
    ctx.body = formatResult(result,true,Tips.HANDLE_SUCCESS);
  }catch (e) {
    ctx.body = formatResult(e,false,Tips.HANDLE_ERR)
  }
});
/**
 * 修改拼团
 */
orderRouter.post('/modify', async (ctx) => {
  const body = {...ctx.request.body}
  const {id,} = body
  delete body.id
  //AES对称加密
  try {
    let result = await Order.update({
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
orderRouter.post('/detail', async (ctx) => {
  try {
    const body = ctx.request.body
    if( !body.id ) throw('没有id')
    // Order.hasMany(GroupAdd)
    // Order.hasMany(GroupAdd)

    // GroupAdd.belongsTo(Order, { foreignKey: 'order_id', targetKey: 'id' });
    Bulk.hasMany(Order, { foreignKey: 'bulk_id', targetKey: 'id' });
    Order.belongsTo(Bulk, { foreignKey: 'bulk_id', targetKey: 'id' });

    //为用户和学校建立关系  一对多
    Order.hasMany(GroupAdd, {
      foreignKey: 'order_id',
      sourceKey: 'id',
      constraints: false
    })
    
    GroupAdd.belongsTo(Order, {
      foreignKey: 'order_id',
      targetKey: 'id',
      constraints: false
    })
    //attributes:需要显示的字段
    const orderesult = await Order.findOne({ where:{id:body.id},include:[{
      model:GroupAdd,
      // where:{
      //   bulk_id:bulk_id
      // },
      attributes: [
        'avatars','bulk_id','nickname','id','parent','uid','status'
      ]
    },{
      model:Bulk
    }]})
    // const groupAddresult = await GroupAdd.findOne({ include:[Order]})
    // const bulkresult = await Bulk.findOne({ where:{id:orderesult.bulk_id}})

    ctx.body = formatResult(orderesult,true,Tips.HANDLE_SUCCESS);
  }catch (e) {
    ctx.body = formatResult({},false,e);
  }
});
/**
 * 删除拼团
 */
orderRouter.post('/remove', async (ctx) => {
  try {
    const {id} = ctx.request.body
    console.log(id);
    if( !id )return ctx.body = formatResult({},false,Tips.LACK_PARAMS)
    let result = await Order.destroy({ where:{id}})
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
 * @apiGroup Order
 * @apiVersion 1.0.0
 */
orderRouter.get('/admin/query', async (ctx) => {
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
    const result = await Order.findAndCountAll({
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
module.exports = orderRouter.routes()
