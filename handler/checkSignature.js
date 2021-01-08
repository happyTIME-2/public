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

async function check(signature, timestamp, nonce) 
{
  const { token } = config;
  const list = [token, timestamp, nonce];
  list.sort();
  let tmpStr = '';
  list.forEach(element => {
    tmpStr += element;
  });

  const sign = sha1(tmpStr);

  return sign === signature ? true : false;
}

module.exports = { check };