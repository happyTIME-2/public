const axios = require('axios').default

axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'


const BASEURL = 'http://www.cwl.gov.cn/';
const TIME_OUT = 5000;

const ERRORTIP = {
	'401': '您还未登录，请先进行登录',
	'404': '对不起，未找到相关资源',
	'500': '服务器异常，请稍后重试',
	'504': '请求超时，请稍后重试'
}

const instance = axios.create({
  baseURL: BASEURL,
  timeout: TIME_OUT
});

const CancelToken = axios.CancelToken;
let source = {};

const request = async (url, params, config, method) => {
  return new Promise((resolve, reject) => {
    axios[method](url, params, Object.assign({}, config))
      .then(response => {
        resolve(response)
      }, err => {
        if (err.Cancel) {
          console.log(err);
        } else {
          reject(err)
        }
      })
      .catch(err => {
        reject(err)
      })
  })
};

instance.interceptors.request.use(config => {
  const request = JSON.stringify(config.url) + JSON.stringify(config.data)
  config.cancelToken = new CancelToken(cancel => {
    source[request] = cancel
  })
  return config
})

instance.interceptors.response.use((response) => {
  return responseHandler(response)
}, err => {
  return errHandler(err)
})

const responseHandler = (response) => {
  if (response.status === 200) {
    return Promise.resolve(response.data)
  } else {
    return Promise.reject(response.statusText)
  }
}

const errHandler = (response) => {
  const errorResponse = {
    code: response.status,
    msg: ERRORTIP[response.status] || '未知错误'
  }

  return Promise.reject(errorResponse)
}

const get = (url, params, config = {}) => {
  return request(url, params, config, 'get')
}

const post = (url, params, config = {}) => {
  return request(url, params, config, 'post')
}

module.exports = {
  source,
  request,
  get,
  post
};