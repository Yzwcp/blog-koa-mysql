const jwt = require('jsonwebtoken')
const OSS = require('ali-oss');
const client = new OSS({
  region: 'oss-cn-hangzhou',
  accessKeyId: 'LTAI5tSVCiLtVtAuTdPRGwXj',
  accessKeySecret: 'Sdd1UvlKU7O1fURsvFVhKgIy837J5r',
  bucket: 'blog-umep',
});
const Tips = {
  QUERY_ERROR:"查询失败！请检查网络",
  LACK_PARAMS:'缺少入参',
  HANDLE_SUCCESS :"操作成功",
  HANDLE_ERR :"操作失败",
  QUERY_ACC_ERROR :"改文章已经设为不可见，或者密码错误",
  HANDLE_WX_HASRECORD:"已经有该数据"
}
module.exports = {
  Tips,
  client,
  /**
   * 格式化输出数据
   * @param data
   * @param success
   * @param message
   * @returns {{reslut, success: *, message: string}}
   */
  formatResult:((data,success,message="ok")=>{
    // if(data.affectedRows<1 && data.insertId <1)
    //   success = false
    //   message = '操作失败'
    return {
      result:data,
      success:success,
      message:message,
    }
  }),
  secret:'umep_app_secret',

  /**
   * 权限校验
   * @param ctx
   * @param next
   * @returns {Promise<void>}
   */
 auth : async (ctx, next) => {
    //取出来源 来源为admin请求的需要token校验
    const {from = null} = ctx.request.query
    if (!from) return await next()
    const { authorization = '' } = ctx.request.header
    const token = authorization.replace('Bearer ', '')
    try {
      jwt.verify(token, 'umep_app_secret',{},(err,dec)=>{
        if(err){
          const error = JSON.parse(JSON.stringify(err))
          if(error.name==='TokenExpiredError'){
            throw ({permissions:false,message:`用户token过期，请重新登录`})
          }
          if(error.name==='JsonWebTokenError'){
            throw ({permissions:false,message:`无效token，请重新登录`})
          }
        }else{
          return dec
        }
      })
    } catch (e) {
      if (!e.permissions){
       return   ctx.throw(401, e.message)
      }
      ctx.throw(401, '用户未登录')
    }
    await next()
  }

};
