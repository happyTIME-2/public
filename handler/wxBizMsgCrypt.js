const { config } = require('../config')
const Prpcrypt = require('./Prpcrypt')
const ErrorCode = require('./ErrorCode')
const { check, getSignature } = require('./checkSignature')
const XMLParser = require('xml2js')
const buildXML = new XMLParser.Builder({ rootName: 'xml', cdata: true, headless: true, renderOpts: { indent: ' ', pretty: 'true' } })
        
async function xmlParser(string) {
  return new Promise((resolve, reject) => {
    XMLParser.parseString(string, { explicitArray: false }, (err, res) => {
      if(err) reject(err)
      resolve(res.xml)
    })
  })
}

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
class wxBizMsgCrypt {
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
   * 
   * @return { object } 返回解密后的明文xml,转换后的json格式的对象
  */
  async decryptMsg(msgSignature, timestamp, nonce, postData)
  {
    if(config.EncodingAesKey.length !== 43) return ErrorCode.IllegalAesKey;

    const pc = new Prpcrypt(config.EncodingAesKey)
    const xml = postData.xml;
    const { encrypt } = xml;
    const encryptMsg = encrypt[0]
    try {
      const res = await check('', timestamp, nonce, encryptMsg, msgSignature, 'msg')
      // 消息体签名验证
      if(res) {
        // 消息解密
        const result = pc.decrypt(encryptMsg);
        const obj = await xmlParser(result)

        return obj;
      }
    } catch (e) {
      throw new Error(e)
    }    
  }

  /**
   * @param { xml } replyMsg 用于加密的明文xml消息体
   * @param { object } options 配置项，包含nonce，timestamp
   * 
   * @return { xml } 返回加密后的明文xml
  */
  async encryptMsg(replyMsg, options)
  {
    const opts = Object.assign({}, options)
    const Nonce = opts.nonce || parseInt((Math.random() * 100000000000), 10)
    const TimeStamp = opts.timestamp || Date.now()

    const pc = new Prpcrypt(config.EncodingAesKey)
    const Encrypt = pc.encrypt(replyMsg)
    const MsgSignature = await getSignature(TimeStamp, Nonce, Encrypt)
    const msg = { Encrypt, Nonce, TimeStamp, MsgSignature }

    return buildXML.buildObject(msg)
  }
}

module.exports = wxBizMsgCrypt