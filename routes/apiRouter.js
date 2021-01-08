const express = require('express');
const { check } = require('../handler/checkSignature');

const router = express.Router();

router.get('/check', async (req, res) => {
  const { signature, timestamp, nonce, echostr } = req.query;

  try {
    const checkResult = await check(signature, timestamp, nonce); 

    const result = checkResult ? echostr : "验证不通过";

    return res.json(result);
  } catch (e) {
    throw new Error(e)
  }
})

module.exports = router;
