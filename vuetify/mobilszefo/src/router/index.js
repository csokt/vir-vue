import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'
import Help from '@/pages/Help'
import Setup from '@/pages/Setup'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/help',
      name: 'Help',
      component: Help
    },
    {
      path: '/setup',
      name: 'Setup',
      component: Setup
    }
  ]
})
