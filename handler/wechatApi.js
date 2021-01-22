const accessToken = require('../handler/accessToken')
const access_token = require('../handler/accessToken')
const axios = require('axios').default

const endPoint = 'https://api.weixin.qq.com'

class wechatApi {
  // uploadMedia(type) {
  //   const path = '/cgi-bin/media/upload'

  //   const apiUrl = `${endPoint}${path}?access_token=${access_token}&type=${type}`
  // }

  getMedia(mediaId) {
    const path = '/cgi-bin/media/get'
    const apiUrl = `${endPoint}${path}?access_token=${access_token}&media_id=${mediaId}`

    const result = '';

    axios.get(apiUrl).then(res => result = res.data).then(e => console.log(e))
  }
}