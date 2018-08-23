import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Tv from './views/Tv.vue'
import Help from './views/Help.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/tv/:id',
      name: 'tv',
      component: Tv
    },
    {
      path: '/help',
      name: 'help',
      component: Help
    }
  ]
})
