const express = require('express');
const { config } = require('../config');
const { check } = require('../handler/checkSignature');
const wxBizMsgCrypt = require('../handler/wxBizMsgCrypt');

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

router.all('/check', async(req, res, next) => {
  console.log(req.method);

  if(req.method == 'POST') {
    const { signature, timestamp, nonce, openid, encrypt_type, msg_signature } = req.query;
    const { postData } = req.body;

    const msg = '';

    wxMsgCrypt.decryptMsg(msg_signature,timestamp, nonce, postData, msg)

    console.log(`signature: ${signature},msg_signature: ${msg_signature}`)

    try {
      const result = await check(signature, timestamp, nonce, msg_signature);
      console.log(result)

    } catch (e) {
      throw new Error(e)
    }
  } else {
    await verification(req, res)
  }
})

module.exports = router;
