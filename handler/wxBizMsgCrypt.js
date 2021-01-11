const config = require('../config')

class wxBizMsgCrypt {
  constructor() {
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