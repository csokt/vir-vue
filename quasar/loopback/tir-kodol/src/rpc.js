import router from './router'
import API from './rest.js'
import Store from './store'

let lastPayload = null

function Log (event, data = {}) {
  const message = {
    user: (Store.user && Store.user.name) || 'nincs',
    privateip: Store.privateIP,
    program: 'tir-kodol',
    event: event,
    path: router.app._route.path,
    role: (Store.user && Store.user.role) || '',
    uzem: (Store.kodol && Store.kodol.uzemnev) || '',
    version: Store.version,
    publicip: Store.publicIP,
    data: data
  }
  const topic = 'log/ui/' + message.program + '/' + message.event
  const payload = JSON.stringify(message)
  if (lastPayload !== payload) {
    API.post('tir/log', {topic: topic, payload: payload})
    lastPayload = payload
  }
}

export { Log }
