const express = require('express');
const { config } = require('../config');
const { check } = require('../handler/checkSignature');
const wxBizMsgCrypt = require('../handler/wxBizMsgCrypt');
const xmlparser = require('express-xml-bodyparser')

const wxMsgCrypt = new wxBizMsgCrypt();

const router = express.Router();

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

      const content  = 'Hello World!'
      const replyNonce =  parseInt((Math.random() * 100000000000), 10)
      const createTime = Date.now()

      const { ToUserName, FromUserName, MsgType } = msg

     // const replyMsg = `<xml><ToUserName><![CDATA[${ToUserName}]]></ToUserName><FromUserName><![CDATA[${FromUserName}]]></FromUserName><CreateTime>${createTime}</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[${content}]]></Content></xml>`

      let replyMsg = '<xml><ToUserName><![CDATA['+ ToUserName +']]></ToUserName>'
      replyMsg += '<FromUserName><![CDATA['+ FromUserName +']]></FromUserName>'
      replyMsg += '<CreateTime>'+ createTime +'</CreateTime>'
      replyMsg += '<MsgType><![CDATA[text]]></MsgType>'
      replyMsg += '<Content><![CDATA['+ content +']]></Content></xml>'

      const result = await wxMsgCrypt.encryptMsg(replyMsg, {
        timestamp: createTime, nonce: replyNonce
      })

      console.log(`msg: ${msg}`);
      console.log(`result: ${result}`);

      res.send(replyMsg)
      // res.send(result)
    } catch(e) {
      throw new Error(e)
    }
  } else {
    await verification(req, res)
  }
})

module.exports = router;
