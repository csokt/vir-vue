import Vue from 'vue'
import Vuex from 'vuex'
import pathify from './pathify'
import { make } from 'vuex-pathify'
// import { API, EventBus } from '@/util'
Vue.use(Vuex)

const state = {
  version: '18.10.26',
  menuLevel: 0, // 0: home page;  1: app selected;   2: app's module page
  appPageTitle: '', // page title if menuLevel === 1
  modulePageTitle: '', // page title if menuLevel === 2
  user: {}
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

window.store = store
export default store
