const DB = require("../../config.js")
class commonMoudles {
  static commonQuery(value,dbName,where="",orderBy,limit){
    const sql = `select * from ${dbName} ${where} order by ${orderBy} limit ${limit}`;
    return  DB.query(sql,value);
  }
  /**
   * 点赞 喜欢
   * @param value
   * @param dbName
   * @param userLikeMd5 用户的md5  浏览器类型+id
   * @param where
   * @returns {Promise<unknown>}
   */
  static guestList(value,dbName,userLikeMd5,where){
    let _sql = 'update '+dbName+' set likeList = concat(likeList,'+'"'+userLikeMd5+',"'+') '+where+''
    return DB.query( _sql, value)
  }
  static countQuery(value,dbName,where){
    const sql = `select   count(*)   as   total   from   ${dbName}  ${where}`;
    return  DB.query(sql,value);
  }
}
module.exports.commonMoudles = commonMoudles
