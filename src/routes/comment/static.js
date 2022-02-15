const DB = require("../../connect/mysql.js")
class commentMoudles {
  static insert(value){
    let _sql = "insert into atc_comment set articleId=?,heroInfo=?,likeList=?,myName=?,parentId=?,type=?,createTime=?,userId=?,value=?"
    return DB.query( _sql, value)
  }
  static remove(value,id){
    let _sql = `DELETE FROM article where id='${id}'`;
    return DB.query( _sql, value)
  }
}
module.exports.commonMoudles = commentMoudles
