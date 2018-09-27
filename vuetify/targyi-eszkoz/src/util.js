import Vue from 'vue'
import apisauce from 'apisauce'

const API = apisauce.create({
  baseURL: '/api/',
  timeout: 15000
})

// #################################################################################################################################
API.setHeader('Authorization', 'mJXHU9pmvrQf3XTyfvUULHcZQZ2FsP28v18mGNHbT3wPIBxJK1Tgv17VE5Y86aPV') //          KIVENNI!!          //
// API.setHeader('Authorization', 'QYwK4HrkhXRdWGzYzpYvllgqWc6afknjANKZQnA3xBQLsdXU185JNMu9FbCPKYnI') //          KIVENNI!!          //
// #################################################################################################################################

const EventBus = new Vue()

export { API, EventBus }
