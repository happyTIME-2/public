const CryptoJS = require('crypto-js')

const crypto = require('crypto');
const { config } = require('../config');

const SIZE = 32;

class Prpcrypt 
{
  constructor(key) {
    this.size = SIZE;

    this.key = Buffer.from(config.EncodingAesKey + '=', 'base64');
    this.iv = this.key.slice(0, 16);
  }

  PKCS7Decoder(buff) {
    const pad = buff[buff.length - 1];

    if (pad < 1 || pad > 32) {
        pad = 0;
    }

    return buff.slice(0, buff.length - pad);
  }

  /**
   * 对明文进行加密
   * 
   * @param { string } text 需要加密的明文
   * @param { string } appid 
   * 
   * @return { string } 加密后的密文
  */
  encrypt(text, appid) {
    const randomStr = this.randomStr()
    let newText = randomStr +  pack('N', text) + text + appid

    let iv = this.key.substr(0, 16)

    newText = this.encode(newText)

    const key = CryptoJS.enc.Hex.parse(this.key)
    iv = CryptoJS.enc.Hex.parse(iv)

    var encrypted = CryptoJS.AES.encrypt(newText, key, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv
    })

    const base64 = CryptoJS.enc.Base64.parse(encrypted)

    return { code: ErrorCode.success, base64 };
  }

  decrypt(encrypted) {
    const aesCipher = crypto.createDecipheriv('aes-256-cbc', this.key, this.iv)
    aesCipher.setAutoPadding(false)

    let decipheredBuff = Buffer.concat([aesCipher.update(encrypted, 'base64'), aesCipher.final()])

    decipheredBuff = this.PKCS7Decoder(decipheredBuff)

    const len_netOrder_corpid = decipheredBuff.slice(16)

    const msg_len = len_netOrder_corpid.slice(0,4).readInt32BE(0)

    const msg = len_netOrder_corpid.slice(4, msg_len + 4).toString()

    const appId = len_netOrder_corpid.slice(msg_len + 4).toString()

    if(appId !== config.AppID) throw new Error('appId is invalid')

    return msg;
  }
}

module.exports = Prpcrypt;