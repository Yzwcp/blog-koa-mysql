const DB = require("../../config.js")
class articleMoudles {
  insert(value){
    let _sql = "insert into article set auth=?,body=?,categorize=?,title=?,tags=?,myDescribe=?,cover=?,likeList=?,createTime=?,updateTime=?;"
    return DB.query( _sql, value)
  }
  modify(value,Id){
    let _sql = `update article set auth=?,body=?,categorize=?,title=?,tags=?,myDescribe=?,cover=?,updateTime=? where Id=${Id}`
    return DB.query( _sql, value)
  }
  remove(value,id){
    let _sql = `DELETE FROM article where id='${id}'`;
    return DB.query( _sql, value)
  }
}
module.exports.commonMoudles = articleMoudles
