const { config } = require('../../config')
const axios = require('axios').default
const { Crypto } = require('cryptojs');

const auth = () => {
  const nowDate = new Date(); 
  const dateTime = nowDate.toUTCString();
  const SecretId = config.SCF_Secret_Id;
  const SecretKey = config.SCF_Secret_Key;
  const source = 'xxxxxx'; 
  const auth = "hmac id=\"" + SecretId + "\", algorithm=\"hmac-sha1\", headers=\"x-date source\", signature=\"";
  const signStr = "x-date: " + dateTime + "\n" + "source: " + source;

  let sign = CryptoJS.HmacSHA1(signStr, SecretKey)
  sign = CryptoJS.enc.Base64.stringify(sign)
  sign = auth + sign + "\""
  
  return {
    source,
    dateTime,
    sign
  }
}

const getSsqData = async () => {
  const apiUrl = "https://service-n8z6vr4y-1255917349.gz.apigw.tencentcs.com/release/ssq";
  const { source, dateTime, sign } = auth();

  const instance = axios.create({
    baseURL: apiUrl,
    timeout: 5000,
    headers: {
      "Source":source,
      "X-Date":dateTime,
      "Authorization":sign
    },
    withCredentials: true
  });
  
  return new Promise((resolve, reject) => {
    instance.get().then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
};

module.exports = getSsqData;

