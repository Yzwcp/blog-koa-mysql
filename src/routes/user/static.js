const DB = require("../../connect/mysql.js")
class userMoudles {
  static insert(value,username){
    let _sql = `insert into user (username,password) select ?,? from dual where not exists(select * from user where username = `+"'"+username+"'"+')'
    return DB.query( _sql, value)
  }
  static login(value,params){
    let _sql = `select * from user where username = '${params.username}' and password='${params.psdMd5}'`
    return DB.query( _sql, value)
  }
  static remove(value,id){
    let _sql = `DELETE FROM article where id='${id}'`;
    return DB.query( _sql, value)
  }
  static conditionQuery(value,params){
    let _sql = `select * from user where username = '${params.username}' `
    return DB.query( _sql, value)
  }
}
module.exports.userMoudles = userMoudles
