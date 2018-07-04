import axios from 'axios'

const token = 'f5dde53149a19f988d8292b10026b6eecace2596'
const REST = axios.create({
  baseURL: 'http://tibor.szefo.local:3000/api/tv/',
  // baseURL: 'http://localhost:3000/api/tv/',
  headers: {
    Authorization: 'Token ' + token
  }
})

export default REST
