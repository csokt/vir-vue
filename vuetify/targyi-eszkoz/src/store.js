import Vue from 'vue'
import Vuex from 'vuex'
import apisauce from 'apisauce'
Vue.use(Vuex)

const API = apisauce.create({
  // baseURL: 'http://tibor.szefo.local:3000/api/',
  baseURL: '/api/',
  timeout: 15000
})

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  state: {
    version: '18.09.15',
    pageTitle: 'Home',
    user: {}
  },

  mutations: {
    setPageTitle (state, title) {
      state.pageTitle = title
    },

    setUser (state, user) {
      state.user = user
    }
  },

  actions: {
    async getUser ({ commit }, token) {
      if (token) {
        const response = await API.post('accounts/pulltoken/' + token)
        if (response.ok) {
          commit('setUser', response.data.user)
          API.setHeader('Authorization', response.data.loopback_token)
        } else {
          console.log(response.problem)
        }
      }
    }
  }
})
