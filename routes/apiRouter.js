const express = require('express');
const { config } = require('../config');
const { check } = require('../handler/checkSignature');
const wxBizMsgCrypt = require('../handler/wxBizMsgCrypt');
const xmlparser = require('express-xml-bodyparser')
const { textMsg } = require('../handler/replyMsg')

const router = express.Router();

const wxMsgCrypt = new wxBizMsgCrypt();
const verification = async(req, res) => {
  const { signature, timestamp, nonce, echostr } = req.query;

  try {
    const checkResult = await check(signature, timestamp, nonce); 

    const result = checkResult ? echostr : "验证不通过";

    res.send(result);
  } catch (e) {
    throw new Error(e)
  }
}

router.all('/check', xmlparser({trim: false, explicitArray: false}), async(req, res, next) => {
  if(req.method == 'POST') {
    const { signature, timestamp, nonce, openid, encrypt_type, msg_signature } = req.query;
    const postData = req.body;

    try {
      const msg = await wxMsgCrypt.decryptMsg(msg_signature,timestamp, nonce, postData)

      const replyNonce =  parseInt((Math.random() * 100000000000), 10)
      const createTime = Date.now()

      // 回复消息跟接收到的消息体内的ToUserName跟FromUserName要对调
      const { ToUserName, FromUserName, MsgType } = msg
      const replyMsg = textMsg(FromUserName, ToUserName, '你好，欢迎调戏前端探索者公众号！')
      const result = await wxMsgCrypt.encryptMsg(replyMsg, {
        timestamp: createTime, nonce: replyNonce
      })

      res.send(result)
    } catch(e) {
      throw new Error(e)
    }
  } else {
    await verification(req, res)
  }
})

module.exports = router;
