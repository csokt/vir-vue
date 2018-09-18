import Vue from 'vue'
import Vuex from 'vuex'
import pathify from './pathify'
import { make } from 'vuex-pathify'
import apisauce from 'apisauce'
Vue.use(Vuex)

const API = apisauce.create({
  // baseURL: 'http://tibor.szefo.local:3000/api/',
  baseURL: '/api/',
  timeout: 15000
})

const state = {
  version: '18.09.15',
  title: 'Home',
  user: {}
}

const mutations = make.mutations(state)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  plugins: [ pathify.plugin ],
  state,
  mutations,

  actions: {
    async getUser ({ commit }, token) {
      if (token) {
        const response = await API.post('accounts/pulltoken/' + token)
        if (response.ok) {
          commit('user', response.data.user)
          API.setHeader('Authorization', response.data.loopback_token)
        } else {
          console.log(response.problem)
        }
      }
    }
  }
})

window.store = store
export default store
