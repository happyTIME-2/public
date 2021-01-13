const should = require('should')
const randomstring = require('randomstring')
const XMLParser = require('xml2js')
const buildXML = new XMLParser.Builder({ rootName: 'xml', cdata: true, headless: true, renderOpts: { indent: ' ', pretty: 'true' } })

async function xmlParser(string) {
  return new Promise((resolve, reject) => {
    XMLParser.parseString(string, { explicitArray: false }, (err, res) => {
      if(err) reject(err)
      resolve(res.xml)
    })
  })
}

const wxBizMsgCrypt = require('../handler/wxBizMsgCrypt')

describe('#main', () => {
  const token = randomstring.generate();
  const encodingAESKey = randomstring.generate(43);
  const appid = randomstring.generate(18);
  const crypto = new wxBizMsgCrypt(token, encodingAESKey, appid);

  let Encrypt, MsgSignature, TimeStamp, Nonce;
  let str, timestamp, nonce, echostr,content, replyMsg;

  it('#encryptMsg', async() => {
    str = randomstring.generate()
    timestamp = `${Date.now()}`
    nonce = randomstring.generate()
    content = "hello World!"

    replyMsg = `<xml><ToUserName><![CDATA[johnsqliu]]></ToUserName><FromUserName><![CDATA[dakgn]]></FromUserName><CreateTime>${timestamp}</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[${content}]]></Content></xml>`

    const result = await crypto.encryptMsg(replyMsg, {
      timestamp, nonce
    })

    try {
      const data = await xmlParser(result)

      MsgSignature = data.MsgSignature
      TimeStamp = data.TimeStamp
      Nonce = data.Nonce
      Encrypt = data.Encrypt
    } catch(e) {
      throw new Error('xmlParser fail!');
    }
  })

  it('#timestamp  should not be undefined', () => {
    should(TimeStamp).equals(timestamp)
  })
  
  it('#nonce should not be undefined', () => {
    should(Nonce).equals(nonce)
  })

  it('#decryptMsg', async() => {
    const postData = {
      tousername: 'johnsqliu',
      xml: {
        encrypt: [Encrypt]
      }
    }

    try {
      echostr = await crypto.decryptMsg(MsgSignature, TimeStamp, Nonce, postData)
    } catch (e) {
      throw new Error('decryptMsg fail!');
    }
  })

  it('#echostr should equals replyMsg', async() => {
    const msgObj = await xmlParser(replyMsg)

    echostr.should.be.an.instanceOf(Object).and.have.property('ToUserName', msgObj.ToUserName)
    echostr.should.have.property('FromUserName', msgObj.FromUserName)
    echostr.should.have.property('CreateTime', msgObj.CreateTime)
    echostr.should.have.property('MsgType', msgObj.MsgType)
    echostr.should.have.property('Content', msgObj.Content)
  })

  it('#timestamp should not be changed', () => {
    should(TimeStamp).equals(timestamp);
  })

  it('#nonce should not be changed', () => {
    should(Nonce).equals(nonce);
  })
})