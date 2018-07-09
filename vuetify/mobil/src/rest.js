import apisauce from 'apisauce'

const API = apisauce.create({
  baseURL: 'http://tibor.szefo.local:3000/api/',
  // baseURL: 'http://localhost:3000/api/tv/',
  timeout: 15000
})

export default API
