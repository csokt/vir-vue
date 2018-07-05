import axios from 'axios'

const token = 'T2D8JAOzS9yFEO3q7jEQ6XZ6EidMxUnpGSHSOksAkI4EURX23XHOprnRWP1roGmR'
const API = axios.create({
  baseURL: 'http://tibor.szefo.local:3000/api/',
  // baseURL: 'http://localhost:3000/api/tv/',
  headers: {
    Authorization: token
  }
})

export default API
