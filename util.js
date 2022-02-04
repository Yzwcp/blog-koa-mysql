
module.exports = {
/**
 * 格式化输出数据
 * @param data
 * @param success
 * @param message
 * @returns {{reslut, success: *, message: string}}
 */
formatResult:((data,success,message="")=>{
  if(data.affectedRows<1 && data.insertId <1)
    success = false
    message = '操作失败'
  return {
    result:data,
    success:success,
    message:message,
  }
})
};