const { config } = require('../config')
const Prpcrypt = require('./Prpcrypt')
const ErrorCode = require('./ErrorCode')
const { check, getSignature } = require('./checkSignature')
const XMLParser = require('xml2js')


const buildXML = new XMLParser.Builder({ rootName: 'xml', cdata: true, headless: true, renderOpts: { indent: ' ', pretty: 'true' } })

const xmlString = `<xml><ToUserName><![CDATA[gh_97e3f7c576ff]]></ToUserName>
                      <FromUserName><![CDATA[ohyI-wec38qQcovc04jqDCyjNPZA]]></FromUserName>
                      <CreateTime>1610520392</CreateTime>
                      <MsgType><![CDATA[text]]></MsgType>
                      <Content><![CDATA[动画]]></Content>
                      <MsgId>23057110593258649</MsgId>
                      </xml>`
                     
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
   * @param { string } msg 解密后的原文，当return返回 0 时有效
   * 
   * @return { int } 成功时返回 0， 错误时返回对应的错误码
  */
  async decryptMsg(msgSignature, timestamp, nonce, postData, msg)
  {
    if(config.EncodingAesKey.length !== 43) return ErrorCode.IllegalAesKey;

    const pc = new Prpcrypt(config.EncodingAesKey)

    const xml = postData.xml;
    const { tousername, encrypt } = xml;
    const encryptMsg = encrypt[0]

    try {
      const res = await check('', timestamp, nonce, encryptMsg, msgSignature, 'msg')
      // 消息体签名验证
      if(res) {
        // 消息解密
        const result = pc.decrypt(encryptMsg);

        const xml = await xmlParser(result)

        return xml;
      }
    } catch (e) {
      throw new Error(e)
    }    
  }

  async encryptMsg(replyMsg, options)
  {
    const opts = Object.assign({}, options)
    const nonce = opts.nonce || parseInt((Math.random() * 100000000000), 10)
    const timestamp = opts.timestamp || Date.now()

    const pc = new Prpcrypt(config.EncodingAesKey)

    const encryptMsg = pc.encrypt(replyMsg)

    const msgSignature = await getSignature(opts.timestamp, opts.nonce, encryptMsg)
    // const msgSignature = await check('', opts.timestamp, opts.nonce, encryptMsg, 'msg')

    const msg = { encryptMsg, nonce, timestamp, msgSignature }

    return buildXML.buildObject(msg)
  }
}

module.exports = wxBizMsgCrypt