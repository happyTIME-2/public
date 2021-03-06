const { config } = require('../config')
const axios = require('axios').default
const { redisGet, resisSet } = require('./redis')

const endPoint = 'https://api.weixin.qq.com'
const path = '/cgi-bin/token'

const setAccessToken = async() => {
  const apiUrl = `${endPoint}${path}?grant_type=client_credential&appid=${config.AppID}&secret=${config.APPSECRET}`
  
  try {
    const access_token = await redisGet('access_token')

    if(access_token === null) {
      axios.get(apiUrl).then(async(res) => {
        await resisSet('access_token', res.data.access_token, res.data.expires_in)
      }).catch(e => console.log(e))
    }

    return access_token;
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = setAccessToken;