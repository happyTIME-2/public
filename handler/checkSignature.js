const { config } = require('../config')
const { createHash } = require('crypto');

/**
 * @param {string} algorithm
 * @param {any} content
 *  @return {string}
 */
const encrypt = (algorithm, content) => {
  let hash = createHash(algorithm)
  hash.update(content)
  return hash.digest('hex')
}

/**
 * @param {any} content
 *  @return {string}
 */
const sha1 = (content) => encrypt('sha1', content)

async function check(signature, timestamp, nonce, msg_encrypt='') 
{
  const { token } = config;
  const list = [token, timestamp, nonce, msg_encrypt];
  list.sort();
  let tmpStr = '';
  list.forEach(element => {
    tmpStr += element;
  });

  const sign = sha1(tmpStr);

  console.log(`sign:${sign}, signature: ${signature}, msg_encrypt: ${msg_encrypt}`)

  if(msg_encrypt !== '') return sign === msg_encrypt ? true : false;

  return sign === signature ? true : false;
}

module.exports = { check };