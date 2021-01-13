const crypto = require('crypto');
const { config } = require('../config');
class Prpcrypt 
{
  constructor(key) {
    this.key = Buffer.from(config.EncodingAesKey + '=', 'base64');
    this.iv = this.key.slice(0, 16);
  }

  /**
   * 以PKCS7模式对buffer数据进行截断，移除补位的字节
   * 
   * @param { Buffer } buff 含有补位字节的buffer
   * @return { Buffer } 删除填充补位后的buffer
  */
  PKCS7Decoder(buff) {
    const pad = buff[buff.length - 1];

    if (pad < 1 || pad > 32) {
        pad = 0;
    }

    return buff.slice(0, buff.length - pad);
  }

  /**
   * 以PKCS7模式对buffer数据进行补位(padding)
   * 
   * @param { Buffer } buff 需进行补位的buffer
   * @return { Buffer } 填充补位后的buffer
  */
  PKCS7Encoder(buff) {
    const blockSize = 32;
    const strSize = buff.length;
    const amountToPad = blockSize - (strSize % blockSize);

    const pad = Buffer.from(amountToPad);
    pad.fill(String.fromCharCode(amountToPad));

    return Buffer.concat([buff, pad]);
}

  /**
   * 对xml明文进行加密
   * 
   * @param { string } xmlMsg 需要加密的xml格式明文 
   * 
   * @return { string } 加密后的密文，base64编码后的格式
  */
  encrypt(xmlMsg) {
    const random16 = crypto.pseudoRandomBytes(16)

    const msg = Buffer.from(xmlMsg)
    const msgLen = Buffer.allocUnsafe(4)
    msgLen.writeInt32BE(msg.length, 0)

    const corpId = Buffer.from(config.AppID)

    const raw_msg = Buffer.concat([random16, msgLen, msg, corpId])
    const encode = this.PKCS7Encoder(raw_msg)

    const cipher = crypto.createCipheriv('aes-256-cbc', this.key, this.iv)
    cipher.setAutoPadding(false)

    const cipherMsg = Buffer.concat([cipher.update(encode), cipher.final()])

    return cipherMsg.toString('base64');
  }

  /**
   * 对密文进行解密
   * 
   * @param { string } encrypted 密文
   * 
   * @return { string } 解密后的明文，对应为xml格式
   * 
  */
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