import Vue from 'vue'
import Vuex from 'vuex'
import pathify from './pathify'
import { make } from 'vuex-pathify'
// import { API, EventBus } from '@/util'
Vue.use(Vuex)

const state = {
  version: '18.11.21',
  pageTitle: '',
  user: {},
  leltariv: {}
}

const mutations = make.mutations(state)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  plugins: [ pathify.plugin ],
  state,
  mutations,

  actions: {
  }
})

export default store
