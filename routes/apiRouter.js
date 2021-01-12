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

    console.dir(postData)

    console.log(`signature: ${signature},msg_signature: ${msg_signature}`)
    
    try {
      const msg = await wxMsgCrypt.decryptMsg(msg_signature,timestamp, nonce, postData)

      console.log(msg);

      return '';
    } catch {
      throw new Error(e)
    }
  } else {
    await verification(req, res)
  }
})

module.exports = router;
