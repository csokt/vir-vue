import Vue from 'vue'
import Store from '@/store'
import { API } from '@/backend/rest.js'

const EventBus = new Vue()

async function getUser (that, route = '') {
  const response = await API.get('accounts/user')
  if (response.ok) {
    Store.user = response.data
    if (route && localStorage.szefo_pin) that.$router.push(route)
  } else {
    Store.user = null
    delete localStorage.szefo_loopback_token
    API.setHeader('Authorization', undefined)
    if (route) that.$router.push(route)
    console.log(response.problem)
  }
}

async function getVirUser (that) {
  const response = await API.get('vir/currentuser')
  if (response.ok) {
    Store.virUser = response.data
  } else {
    Store.virUser = null
    console.log(response.problem)
  }
}

export { EventBus, getUser, getVirUser }
