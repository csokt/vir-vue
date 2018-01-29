import mqtt from 'mqtt'

const cid = Math.random().toString(36).replace('0.', '')
const requestBase = 'mssql/request/' + cid + '/'
const responseBase = 'mssql/response/' + cid + '/'

let resolver = {}

const client = mqtt.connect('wss://mqtts.szefo.local:8880', {username: 'admin', password: 'Szefo1953'})
client.subscribe(responseBase + '#')

client.on('message', function (topic, message) {
  const id = topic.replace(responseBase, '')
  if (resolver[id]) {
    const result = JSON.parse(message.toString())
    resolver[id].resolve(result)
    delete resolver[id]
  }
})

function callMethod (method, params) {
  return new Promise((resolve, reject) => {
    const id = Math.random().toString(36).replace('0.', '')
    let request = {
      jsonrpc: '2.0',
      method: method,
      params: params,
      id: id
    }
    client.publish(requestBase + id, JSON.stringify(request))
    resolver[id] = {resolve: resolve, reject: reject}
  })
}

function callRaw (query) {
  const params = {
    database: 'SzefoModulKeszlet',
    query: query
  }
  return callMethod('raw', params)
}

export default callMethod
export { callRaw }
