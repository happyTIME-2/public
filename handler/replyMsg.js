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


module.exports = { textMsg };