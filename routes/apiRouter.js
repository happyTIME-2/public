const express = require('express');
const { check } = require('../handler/checkSignature');
const WxBizMsgCrypt = require('../handler/WxBizMsgCrypt');

const wxMsgCrypt = new WxBizMsgCrypt();

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

router.all('/check', async(req, res, next) => {
  console.log(req.method);

  if(req.method == 'POST') {
    const { signature, timestamp, nonce, openid, encrypt_type, msg_signature } = req.query;
    const { postData } = req.body;

    console.log(`signature: ${signature}, timestamp: ${timestamp}, nonce: ${nonce}, openid: ${openid}, encrypt_type: ${encrypt_type}, msg_signature: ${msg_signature}`);

    console.log(postData)

    // wxMsgCrypt.decryptMsg();
    // wxMsgCrypt.encryptMsg();
  } else {
    await verification(req, res)
  }
})

module.exports = router;
