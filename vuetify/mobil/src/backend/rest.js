import apisauce from 'apisauce'
import Store from '@/store'

const API = apisauce.create({
  baseURL: 'http://tibor.szefo.local:3000/api/',
  // baseURL: 'http://localhost:3000/api/tv/',
  timeout: 15000,
  headers: {
    Authorization: localStorage.szefo_loopback_token
  }
})

async function getUser () {
  const response = await API.get('accounts/user')
  if (response.ok) {
    Store.user = response.data
  } else {
    Store.user = null
    delete localStorage.szefo_loopback_token
    console.log(response.problem)
  }
}

async function login (username = 'csok.tibor', password = 'tiborc') {
  const response = await API.post('Users/login', {username: username, password: password})
  console.log(response)
  if (response.ok) {
    const token = response.data.id
    console.log('login', token)
    localStorage.szefo_loopback_token = token
    API.setHeader('Authorization', token)
    getUser()
  } else {
    console.log(response.problem)
  }
}

async function logout () {
  const response = await API.post('Users/logout')
  console.log(response)
  if (response.ok) {
    delete localStorage.szefo_loopback_token
    API.setHeader('Authorization', undefined)
    console.log('logged out')
    getUser()
  } else {
    console.log(response.problem)
  }
}

export { API, getUser, login, logout }
