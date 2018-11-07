import Vue from 'vue'
import apisauce from 'apisauce'

const API = apisauce.create({
  baseURL: '/api/',
  timeout: 5000
})

// #################################################################################################################################
// API.setHeader('Authorization', 'mJXHU9pmvrQf3XTyfvUULHcZQZ2FsP28v18mGNHbT3wPIBxJK1Tgv17VE5Y86aPV') //          KIVENNI!!          //
// #################################################################################################################################

const EventBus = new Vue()

const groupId = {
  LeltarViewer: 18,
  LeltarUser: 19,
  ChanceViewer: 57,
  ChanceUser: 58,
  LegrandViewer: 66,
  LegrandUser: 67
}

export { API, EventBus, groupId }
