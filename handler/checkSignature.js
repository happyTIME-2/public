const { config } = require('../config')
const CryptoJS = require('crypto-js')

async function check(signature, timestamp, nonce, msg_encrypt='') 
{
  const { token } = config;
  const list = [token, timestamp, nonce, msg_encrypt];
  list.sort();
  const sign = CryptoJS.SHA1(list.join("")).toString();

  console.log(`sign:${sign}, signature: ${signature}, msg_encrypt: ${msg_encrypt}`)

  if(msg_encrypt !== '') return sign === msg_encrypt ? true : false;

  return sign === signature ? true : false;
}

module.exports = { check };