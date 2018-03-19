import router from './router'
import mqtt from 'mqtt'
import Store from './store'

const cid = Math.random().toString(36).replace('0.', '')
const mssqlRequestBase = 'mssql/request/' + cid + '/'
const mssqlResponseBase = 'mssql/response/' + cid + '/'
const prefix = Store.teszt ? 'teszt/' : ''
const damakodolRequestBase = prefix + 'tir/dama/kodol/request/' + cid + '/'
const damakodolResponseBase = prefix + 'tir/dama/kodol/response/' + cid + '/'

let resolver = {}

const client = mqtt.connect('wss://mqtts.szefo.local:8880', {username: 'admin', password: 'Szefo1953'})
client.subscribe(mssqlResponseBase + '#')
client.subscribe(damakodolResponseBase + '#')

client.on('message', function (topic, message) {
  const id = topic.split('/').slice(-1)[0]
  if (resolver[id]) {
    const result = JSON.parse(message.toString())
    resolver[id].resolve(result)
    delete resolver[id]
  }
})

let lastPayload = null

function Log (event, data = {}) {
  const message = {
    program: 'tir-kodol',
    event: event,
    path: router.app._route.path,
    user: Store.user && Store.user.name,
    data: data
  }
  const payload = JSON.stringify(message)
  if (lastPayload !== payload) {
    client.publish(prefix + 'log/ui/' + message.program + '/' + message.event, payload)
    lastPayload = payload
  }
}

function rpcPublish (method, params, requestBase) {
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

function RpcRaw (query) {
  const params = {
    database: 'SzefoModulKeszlet',
    query: query
  }
  return rpcPublish('raw', params, mssqlRequestBase)
}

function RpcView (view, filter) {
  const params = {
    view: view,
    filter: filter
  }
  return rpcPublish('view', params, mssqlRequestBase)
}

function RpcKodol (params) {
  return rpcPublish('kodol', params, damakodolRequestBase)
}

export { RpcRaw, RpcView, RpcKodol, Log }
