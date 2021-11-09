const { config } = require('../config')
const axios = require('axios').default
const { redisGet, redisSet } = require('./redis')

const endPoint = 'https://api.weixin.qq.com'
const path = '/cgi-bin/token'

const setAccessToken = async() => {
  const apiUrl = `${endPoint}${path}?grant_type=client_credential&appid=${config.AppID}&secret=${config.APPSECRET}`
  
  try {
    const access_token = await redisGet('access_token')

    if(access_token === null) {
      const response = await axios.get(apiUrl)
      const { access_token, expires_in } = response.data
      await redisSet('access_token', access_token, expires_in)

      return access_token;
    }

    return access_token;
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = setAccessToken;