const CryptoJS = require('crypto-js')

const SIZE = 32;

class Prpcrypt 
{
  constructor(key) {
    this.size = SIZE;

    this.key = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(key + '='));
  }

  /**
   * 对需要加密的明文进行填充补位
   * @param { string } text 需要进行填充补位操作的明文
   * 
   * @return { string } 补齐明文字符串
  */
  encode(text) {
    const length = text.length
    const padAmount = this.size - (length % this.size) == 0 ? this.size : this.size - (length % this.size);
    const char = String.fromCharCode(fillAmount)
    const padStr = ''.padEnd(padAmount, char)

    const str = text + padStr;

    return str;
  }

  /**
   * 对解密后的明文进行补位删除
   * @param { string } text 解密后的明文
   * @return { string } 删除填充补位后的明文
  */
  decode(text)  {
    let pad = String.charCodeAt(text.substr(-1))
    if(pad < 1 || pad > 32) pad = 0;

    return text.substr(0, text.length - pad)
  }


  /**
   * 生成16位随机字符串
   * @return { string } 生成的字符串
  */
  randomStr() {
    const strPol = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
    const max = strPol.length - 1;

    let str = '';

    for(let i = 0; i< 16; i++) {
      str += strPol[Math.floor(Math.random() * max)]
    }

    return str;
  }

  /**
   * 对明文进行加密
   * 
   * @param { string } text 需要加密的明文
   * @param { string } appid 
   * 
   * @return { string } 加密后的密文
  */
  encrypt(text, appid) {
    const randomStr = this.randomStr()
    let newText = randomStr +  pack('N', text) + text + appid

    let iv = this.key.substr(0, 16)

    newText = this.encode(newText)

    const key = CryptoJS.enc.Hex.parse(this.key)
    iv = CryptoJS.enc.Hex.parse(iv)

    var encrypted = CryptoJS.AES.encrypt(newText, key, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv
    })

    const base64 = CryptoJS.enc.Base64.parse(encrypted)

    return { code: ErrorCode.success, base64 };
  }

  decrypt(encrypted, appid) {
    const decodeMsg = CryptoJS.enc.Base64.stringify(encrypted)
    const iv = CryptoJS.enc.Utf8.parse(this.key.substr(0, 16))

    const key = CryptoJS.enc.Base64.parse(this.key)
    console.log(iv)
    console.log(key)

    const decrypted = CryptoJS.AES.decrypt(decodeMsg, key, { 
      mode: CryptoJS.mode.CBC, 
      padding: CryptoJS.pad.Pkcs7, 
      iv
    }) 

    const decryptedMsg = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))

    console.log(`decrypted" ${decrypted}, decryptedMsg: ${decryptedMsg}`)

    // if (decodeBase64.length < 16) return '';

    // const content = decodeBase64.substr(16, decodeBase64.length)
    
    // return content
  }
}

module.exports = Prpcrypt;