const wechatApi = require('../handler/wechatApi')

const history = async() => {
  const api = new wechatApi()
  const list = await api.getMediaList('news', 0 ,6)

  let links = '';
  list.map(i => {
    links += `<a href='${i.url}'>${i.title}</a>`
  })

  return links;
}

module.exports = history;