// const crypto = require('crypto-js')
// const secret = "umepblog"
//
// // AES加盐密码
// function AES(target) {
//   return crypto.AES.encrypt(target, secret).toString()
// }
//
// // AES密码解析
// function AESparse(hash) {
//   return crypto.AES.decrypt(hash, secret).toString(crypto.enc.Utf8)
// }
//
// module.exports = {
//   AES, AESparse
// }

const crypto = require('crypto');
//AES对称加密
const secretkey = 'blog'; //唯一（公共）秘钥
function encrypt(a) {
  const content = a;
  const cipher = crypto.createCipher('aes192', secretkey); //使用aes192加密
  let enc = cipher.update(content, 'utf8', 'hex'); //编码方式从utf-8转为hex;
  return (enc += cipher.final('hex')); //编码方式转为hex;
}
function decrypt(enc) {
  //AES对称解密
  const decipher = crypto.createDecipher('aes192', secretkey);
  let dec = decipher.update(enc, 'hex', 'utf8');
  dec += decipher.final('utf8');
  console.log('AES对称解密结果：' + dec);
  return dec
}
module.exports = {
  encrypt, decrypt
}
