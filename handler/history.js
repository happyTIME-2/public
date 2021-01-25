const wechatApi = require('../handler/wechatApi')

const history = async() => {
  const api = new wechatApi()
  const list = await api.getMediaList('news', 0 ,6)

  let links = '历史文章列表: \n';
  list.map((i,index) => {
    links += `${index+1}.<a href='${i.url}'>${i.title}</a> \n`
  })

  return links;
}

module.exports = history;