import Vue from 'vue'
import Vuex from 'vuex'
import pathify from './pathify'
import { make } from 'vuex-pathify'
// import { API, EventBus } from '@/util'
Vue.use(Vuex)

const state = {
  version: '19.04.04',
  pageTitle: '',
  showFilterIcon: false,
  showFilter: false,
  defaults: {},
  user: {},
  kodol: {},
  kodolasok: [],
  atadasok: [],
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
