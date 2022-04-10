const jwt = require('jsonwebtoken')
const key = "blog";
function setToken(payload,expiresIn="1d") {
  return new Promise((resolve, reject) => {
    // algorithm:'' 
    jwt.sign(payload, key, { expiresIn,}, (err, hash) => {
      err ? reject(err.message) : resolve(hash)
    })
  })
}
/**
 * 需要验证的Token
 * @param {String} token
 */
function verifyToken(token) {
  return new Promise((resolve, reject) => {

    jwt.verify(token, key, (err,doc) => {
      if (err) {
        switch (err.name) {
          case 'JsonWebTokenError': reject({ message:"token错误",success:false }); break;
          case 'TokenExpiredError': reject({ message:'token过期',success:false }); break;
        }
      } else {
        resolve({ result:doc,success:true })
      }
    })
  })
}
const whiteList = ['/']
module.exports = {
  setToken,
  verifyToken
}
