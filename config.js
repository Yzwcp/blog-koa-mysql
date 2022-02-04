
var mysql = require('mysql');

/**
 * 格式化输出数据
 * @param data
 * @param success
 * @param message
 * @returns {{reslut, success: *, message: string}}
 */
function formatResult(data,success,message="操作成功"){
  if(data.affectedRows<1 && data.insertId <1){
    success = false
    message = '添加失败,可能已经有这条数据了'
  }
  if(data.affectedRows<1 && data.changedRows <1){
    success = false
    message = '修改失败！'
  }
  if(data.sqlMessage){
    success = false
    message = data.sqlMessage
  }
  return {
    result:data,
    success:success,
    message:message,
  }
}
// 建立链接
let pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'blog'
})

exports.query = ( sql, values ) => {
    return new Promise(( resolve, reject ) => {
        pool.getConnection(function(err, connection) {
            if (err) {
              resolve( formatResult(err,false) )
            } else {
                connection.query(sql, values, ( err, fields) => {
                    if ( err )   resolve( formatResult(err,false) )
                    else  resolve( formatResult(fields,true) )
                    connection.release();
                })
            }
        })
    })
}
 
 