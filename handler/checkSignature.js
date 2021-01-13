const { config } = require('../config')
const crypto = require('crypto')

/**
 * 签名验证
 * @param { string } signature 服务器配置时，微信服务器通过get请求,URL携带的signature
 * @param { string } timestamp 微信服务器请求时（get|post）,URL携带的timestamp
 * @param { string } nonce 微信服务器请求时（get|post）,URL携带的nonce
 * @param { string } msg_encrypt 加解密消息体的时候，提取的密文消息体
 * @param { string } msg_signature 接收消息时，微信服务器post请求时,URL携带的msg_signature
 * @param { string } type "msg" | "verification" 表示验证签名的类型，对应post请求时携带了消息的验证，以及配置服务器时，微信服务器get请求的验证
 * 
 * @return { boolean } 
*/
async function check(signature, timestamp, nonce, msg_encrypt='', msg_signature='', type = 'verification') 
{
  const { token } = config;
  const list = [token, timestamp, nonce, msg_encrypt];
  list.sort();
  const sign = crypto.createHash('sha1').update(list.join('')).digest('hex').toString();
  // const sign = CryptoJS.SHA1(list.join("")).toString();

  if(type === 'msg') return sign === msg_signature ? true : false;

  return sign === signature ? true : false;
}

module.exports = { check };