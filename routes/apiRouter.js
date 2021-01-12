const express = require('express');
const { config } = require('../config');
const { check } = require('../handler/checkSignature');
const wxBizMsgCrypt = require('../handler/wxBizMsgCrypt');
const xml2json = require('xml2json')

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
    const postData = JSON.stringify(req.body);

    req.rawBody = '';
    var json={};
    req.setEncoding('utf8');

    req.on('data', function(chunk) { 
      req.rawBody += chunk;
    })
    
    req.on('end', function() {
      json=xml2json.toJson(req.rawBody);
      console.log(json)
    })

    console.log(`signature: ${signature},msg_signature: ${msg_signature},postData:${postData}`)
    
    const msg = '';
    wxMsgCrypt.decryptMsg(msg_signature,timestamp, nonce, postData, msg)
  } else {
    await verification(req, res)
  }
})

module.exports = router;
