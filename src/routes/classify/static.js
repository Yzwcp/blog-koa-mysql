const DB = require("../../connect/mysql.js")
class classifyMoudles {
  insert(value){
    let _sql = "insert into atc_classify set label=?,value=?"
    return DB.query( _sql, value)
  }
  modify(value,params){
    let _sql = `update atc_classify set label=?,value=? where id=${params}`
    return DB.query( _sql, value)
  }
  remove(value,id){
    let _sql = `DELETE FROM atc_classify where id='${id}'`;
    return DB.query( _sql, value)
  }
}
module.exports.commonMoudles = classifyMoudles
