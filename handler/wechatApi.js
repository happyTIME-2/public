const setAccessToken = require('../handler/accessToken')
const axios = require('axios').default

const endPoint = 'https://api.weixin.qq.com'

async function axiosPost(url, data) {
  return new Promise((resolve, reject) => {
    axios.post(url, data).then(res => resolve(res.data)).catch(e => reject(e))
  })
}

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

  async getMediaList(type, offset, count) {
    try {
      const access_token = await setAccessToken()

      console.log(access_token)
      const path = '/cgi-bin/material/batchget_material'
      const apiUrl = `${endPoint}${path}?access_token=${access_token}`

      const postData = { type,offset, count }

      const res = await axiosPost(apiUrl, postData);
      const list = []

      res.item.map(i => {
        list.push({
          'title': i.content.news_item[0].title,
          'url': i.content.news_item[0].url,
          'content_source_url':  i.content.news_item[0].content_source_url,
          'thumb_media_id': i.content.news_item[0].thumb_media_id,
          'media_id': i.media_id
        })
      })

      return list;
    } catch (e) {
      throw new Error(e)
    }
  }
}

module.exports = wechatApi