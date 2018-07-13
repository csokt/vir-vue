import apisauce from 'apisauce'

const API = apisauce.create({
  baseURL: 'http://tibor.szefo.local:3000/api/',
  // baseURL: 'http://localhost:3000/api/tv/',
  // headers: {
  //   Authorization: sessionStorage.szefo_loopback_token
  // },
  timeout: 15000
})

export default API
