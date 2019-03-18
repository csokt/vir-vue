import Vue from 'vue'
import Vuex from 'vuex'
import pathify from './pathify'
import { make } from 'vuex-pathify'
// import { API, EventBus } from '@/util'
Vue.use(Vuex)

const state = {
  version: '19.03.05',
  pageTitle: '',
  showFilterIcon: false,
  showFilter: false,
  defaults: {},
  user: {},
  kodol: {},
  infok: [],
  views: [],
  kezdIdo: '05:30'
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
