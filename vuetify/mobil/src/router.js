import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Setup from './views/Setup.vue'
import Help from './views/Help.vue'
import NotFound from './views/NotFound.vue'

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
      path: '/setup',
      name: 'setup',
      component: Setup
    },
    {
      path: '/help',
      name: 'help',
      component: Help
    },
    {
      path: '*',
      name: 'notfound',
      component: NotFound
    }
  ]
})
