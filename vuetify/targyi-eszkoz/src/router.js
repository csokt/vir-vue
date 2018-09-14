import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
// import Info from './views/Info.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/info',
      name: 'info',
      component: () => import(/* webpackChunkName: "info" */ './views/Info.vue')
    },
    {
      path: '/athelyezes',
      name: 'athelyezes',
      component: () => import(/* webpackChunkName: "athelyezes" */ './views/Athelyezes.vue')
    },
    {
      path: '/erkeztetes',
      name: 'erkeztetes',
      component: () => import(/* webpackChunkName: "erkeztetes" */ './views/Erkeztetes.vue')
    },
    {
      path: '/leltar',
      name: 'leltar',
      component: () => import(/* webpackChunkName: "leltar" */ './views/Leltar.vue')
    }
  ]
})
