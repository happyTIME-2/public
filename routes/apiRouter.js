const express = require('express');
const { check } = require('../handler/checkSignature');
const wxBizMsgCrypt = require('../handler/wxBizMsgCrypt');
const xmlparser = require('express-xml-bodyparser')
const { textMsg, voiceMsg, videoMsg, musicMsg, newsMsg } = require('../handler/replyMsg')
const history = require('../handler/history')

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

      const links = await history()
      const replyMsg = textMsg(FromUserName, ToUserName, links)

      //const replyMsg = newsMsg(FromUserName, ToUserName, 1, '图片合成类H5总结', '最近越来越多图片合成类的H5需求，让用户通过H5页面的交互选择，最后根据用户的选择生成一张合成图片，让用户长按保存图片并引导用户分享该图片', 'https://www.imiaomeng.com/uploads/allimg/190712/1-1ZG209342bO.jpg', 'https://mp.weixin.qq.com/s/6s2p3976CUH6XxxF4pdmkg')
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
