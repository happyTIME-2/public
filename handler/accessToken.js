const { config } = require('../config')
const axios = require('axios').default
const { redisGet, resisSet } = require('./redis')

const endPoint = 'https://api.weixin.qq.com'
const path = '/cgi-bin/token'

let accessToken = null
const setAccessToken = async() => {
  const apiUrl = `${endPoint}${path}?grant_type=client_credential&appid=${config.AppID}&secret=${config.APPSECRET}`
  
  try {
    accessToken = await redisGet('access_token')

    if(accessToken === null) {
      axios.get(apiUrl).then(async(res) => {
        accessToken = await resisSet('access_token', res.data.access_token, res.data.expires_in)
      }).catch(e => console.log(e))
    }
  } catch (e) {
    throw new Error(e)
  }
}

setAccessToken()

module.exports = accessToken;