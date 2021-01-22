const { config } = require('../config')
const redis = require('redis')

const client = redis.createClient(config.REDIS_PORT, config.REDIS_HOST, {
  auth_pass: config.REDIS_PWD
})

client.on('error', (err) => {
  console.log(err)
})

async function redisGet(key) {
  return new Promise((resolve, reject) => {
    client.get(key, (err, value) => {
      if(err) reject(err)
      resolve(value)
    })
  })
}

async function resisSet(key, value, expires) {
  return new Promise((resolve, reject) => {
    client.set(key, value, 'EX', expires, (err, data) => {
      if(err) reject(err)
      resolve(data)
    })
  })
}

module.exports = { redisGet, resisSet }