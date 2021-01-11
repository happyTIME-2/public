const { config } = require('../config')
class wxBizMsgCrypt {
  constructor() {
    console.log(`token: ${config.token}, encodingAesKey: ${config.encodingAesKey}, appid: ${config.appid}`)

    this.token = config.token;
    this.encodingAesKey = config.encodingAesKey
    this.appid = config.appid
  }

  async decryptMsg(msgSignature, timestamp, nonce, postData, msg)
  {
    console.log('decryptMsg')
  }

  async encryptMsg(replayMsg, timestamp, nonce, encryptMsg)
  {
    console.log('encryptMsg')
  }
}

module.exports = wxBizMsgCrypt