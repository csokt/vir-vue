import Vue from 'vue'
import apisauce from 'apisauce'

const API = apisauce.create({
  baseURL: '/api/',
  timeout: 15000
})

const EventBus = new Vue()

export { API, EventBus }
