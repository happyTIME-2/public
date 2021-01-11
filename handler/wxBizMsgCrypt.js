const { config } = require('../config')
const ErrorCode = require('./ErrorCode')

/**
 * 微信公众号消息加解密类
 * 包含接收到公众号消息体解密 / 回复消息体的加密 方法接口 
 * 
 * 
 * @method decryptMsg 检验消息的真实性，并且获取解密后的明文
 * @method encryptMsg 将公众平台回复用户的消息加密打包
 * 
 * @date 2021-01-11
 * @author happyTIME_2<iloveyouhappytime@gmail.com>
*/
class WxBizMsgCrypt {
  /**
   * 构造函数
   * 
   * @param { string } token  公众号后台服务器配置的令牌（token）
   * @param { EncodingAesKey } 公众号后台服务器配置的消息加解密密钥（EncodingAESKey）
   * @param { AppId }  公众号开发ID（AppID）
  */
  constructor() {
    this.token = config.token;
    this.EncodingAesKey = config.EncodingAesKey
    this.AppID = config.AppID
  }

  /**
   * @param { string } msgSignature 签名串，对应URL参数的msg_signature
   * @param { string } timestamp 时间戳，对应URL参数的timestamp
   * @param { string } nonce 随机字符串，对应URL参数的nonce
   * @param { string } postData 密文，对应POST请求的数据
   * @param { string } msg 解密后的原文，当return返回 0 时有效
   * 
   * @return { int } 成功时返回 0， 错误时返回对应的错误码
  */
  async decryptMsg(msgSignature, timestamp, nonce, postData, msg)
  {
    if(msgSignature.length !== 43) return ErrorCode.IllegalAesKey;

    console.log('decryptMsg')
  }

  async encryptMsg(replayMsg, timestamp, nonce, encryptMsg)
  {
    console.log('encryptMsg')
  }
}

module.exports = WxBizMsgCrypt