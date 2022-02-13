const DB = require("../../config.js")
class tagsMoudles {
  static insert(value){
    let _sql = `insert into atc_tags (label,value) select ?,? from dual where not exists(select * from atc_tags where value =?)`
    return DB.query( _sql, value)
  }
  static modify(value,params){
    let _sql = `update atc_tags set label=?,value=? where id=${params}`
    return DB.query( _sql, value)
  }
  static remove(value,id){
    let _sql = `DELETE FROM article where id='${id}'`;
    return DB.query( _sql, value)
  }
  static conditionQuery(value,params){
    
  }
}
module.exports.tagsMoudles = tagsMoudles
