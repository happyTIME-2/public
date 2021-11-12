/**
 * 用于公众号回复的不同消息类型需要的XML数据
 * @date 2021-01-11
 * @author happyTIME_2<iloveyouhappytime@gmail.com>
*/

/**
 * @param { string } FromUserName (发送者) ,公众号自动回复则为公众号OpenID
 * @param { string } ToUserName (接收者) ,公众号自动回复则为接收消息的用户的微信号
 * @param { string } content 发送的文本内容
*/
const textMsg = (ToUserName, FromUserName, content) => {
  const msg = `<xml>
    <ToUserName><![CDATA[${ToUserName}]]></ToUserName>
    <FromUserName><![CDATA[${FromUserName}]]></FromUserName>
    <CreateTime>${Date.now()}</CreateTime>
    <MsgType><![CDATA[text]]></MsgType>
    <Content><![CDATA[${content}]]></Content>
  </xml>`

  return msg
}

/**
  * @param { string } FromUserName (发送者) ,公众号自动回复则为公众号OpenID
  * @param { string } ToUserName (接收者) ,公众号自动回复则为接收消息的用户的微信号
  * @param { string } MediaId 通过素材管理中的接口上传多媒体文件，得到的id
*/
const imageMsg = (ToUserName, FromUserName, MediaId) => {
  return `<xml>
    <ToUserName><![CDATA[${ToUserName}]]></ToUserName>
    <FromUserName><![CDATA[${FromUserName}]]></FromUserName>
    <CreateTime>${Date.now()}</CreateTime>
    <MsgType><![CDATA[image]]></MsgType>
    <Image>
      <MediaId><![CDATA[${MediaId}]]></MediaId>
    </Image>
  </xml>`;
}

/**
  * @param { string } FromUserName (发送者) ,公众号自动回复则为公众号OpenID
  * @param { string } ToUserName (接收者) ,公众号自动回复则为接收消息的用户的微信号
  * @param { string } MediaId 通过素材管理中的接口上传多媒体文件，得到的id
*/
const voiceMsg = (ToUserName, FromUserName, MediaId) => {
  return `<xml>
    <ToUserName><![CDATA[${ToUserName}]]></ToUserName>
    <FromUserName><![CDATA[${FromUserName}]]></FromUserName>
    <CreateTime>${Date.now()}</CreateTime>
    <MsgType><![CDATA[voice]]></MsgType>
    <Image>
      <MediaId><![CDATA[${MediaId}]]></MediaId>
    </Image>
  </xml>`;
}

/**
  * @param { string } FromUserName (发送者) ,公众号自动回复则为公众号OpenID
  * @param { string } ToUserName (接收者) ,公众号自动回复则为接收消息的用户的微信号
  * @param { string } MediaId 通过素材管理中的接口上传多媒体文件，得到的id
  * @param { string } title 视频消息的标题
  * @param { string } description 视频消息的描述
*/
const videoMsg = (ToUserName, FromUserName, MediaId, title, description) => {
  return `<xml>
    <ToUserName><![CDATA[${ToUserName}]]></ToUserName>
    <FromUserName><![CDATA[${FromUserName}]]></FromUserName>
    <CreateTime>${Date.now()}</CreateTime>
    <MsgType><![CDATA[video]]></MsgType>
    <Video>
      <MediaId><![CDATA[${MediaId}]]></MediaId>
      <Title><![CDATA[${title}]]></Title>
      <Description><![CDATA[${description}]]></Description>
    </Video>
  </xml>`;
}

/**
  * @param { string } FromUserName (发送者) ,公众号自动回复则为公众号OpenID
  * @param { string } ToUserName (接收者) ,公众号自动回复则为接收消息的用户的微信号
  * @param { string } title 音乐标题
  * @param { string } description 音乐描述
  * @param { string } musicUrl 音乐链接
  * @param { string } hQMusicUrl 高质量音乐链接，WIFI环境优先使用该链接播放音乐
  * @param { string } thumbMediaId 缩略图的媒体id，通过素材管理中的接口上传多媒体文件，得到的id
*/
const musicMsg = (ToUserName, FromUserName, title, description, musicUrl, hQMusicUrl, thumbMediaId) => {
  return `<xml>
    <ToUserName><![CDATA[${ToUserName}]]></ToUserName>
    <FromUserName><![CDATA[${FromUserName}]]></FromUserName>
    <CreateTime>${Date.now()}</CreateTime>
    <MsgType><![CDATA[music]]></MsgType>
    <Music>
      <Title><![CDATA[${title}]]></Title>
      <Description><![CDATA[${description}]]></Description>
      <MusicUrl><![CDATA[${musicUrl}]]></MusicUrl>
      <HQMusicUrl><![CDATA[${hQMusicUrl}]]></HQMusicUrl>
      <ThumbMediaId><![CDATA[${thumbMediaId}]]></ThumbMediaId>
    </Music>
  </xml>`;
}

/**
  * @param { string } FromUserName (发送者) ,公众号自动回复则为公众号OpenID
  * @param { string } ToUserName (接收者) ,公众号自动回复则为接收消息的用户的微信号
  * @param { int } articleCount 图文消息个数；当用户发送文本、图片、语音、视频、图文、地理位置这六种消息时，开发者只能回复1条图文消息；其余场景最多可回复8条图文消息
  * @param { string } title 图文消息标题
  * @param { string } description 图文消息描述
  * @param { string } picurl 图片链接，支持JPG、PNG格式，较好的效果为大图360*200，小图200*200
  * @param { string } url 通点击图文消息跳转链接
*/
const newsMsg = (ToUserName, FromUserName, articleCount = 1, title, description, picurl, url) => {
  return `<xml>
    <ToUserName><![CDATA[${ToUserName}]]></ToUserName>
    <FromUserName><![CDATA[${FromUserName}]]></FromUserName>
    <CreateTime>${Date.now()}</CreateTime>
    <MsgType><![CDATA[news]]></MsgType>
    <ArticleCount>${articleCount}</ArticleCount>
    <Articles>
      <item>
        <Title><![CDATA[${title}]]></Title>
        <Description><![CDATA[${description}]]></Description>
        <PicUrl><![CDATA[${picurl}]]></PicUrl>
        <Url><![CDATA[${url}]]></Url>
      </item>
    </Articles>
  </xml>`;
}

/**
 * 链接消息类型，对应MsgType的值为link
 * @param { string } FromUserName (发送者) ,公众号自动回复则为公众号OpenID
 * @param { string } ToUserName (接收者) ,公众号自动回复则为接收消息的用户的微信号
 * @param { string } title 消息标题
 * @param { string } description 消息描述
 * @param { string } url 消息链接
 * 
*/
const linkMsg = (ToUserName, FromUserName, title, description, url) => {
  return `<xml>
    <ToUserName><![CDATA[${ToUserName}]]></ToUserName>
    <FromUserName><![CDATA[${FromUserName}]]></FromUserName>
    <CreateTime>${Date.now()}</CreateTime>
    <MsgType><![CDATA[link]]></MsgType>
    <Title><![CDATA[${title}]]></Title>
    <Description><![CDATA[${description}]]></Description>
    <Url><![CDATA[${url}]]></Url>
  </xml>`
}

export default { textMsg, imageMsg, voiceMsg, videoMsg, musicMsg, newsMsg, linkMsg };