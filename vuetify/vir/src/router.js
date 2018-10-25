import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import VirMenu from './views/VirMenu.vue'
// import Info from './views/Info.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/legrand',
      props: { app: 'legrand' },
      component: VirMenu
    },
    {
      path: '/chance',
      props: { app: 'chance' },
      component: VirMenu
    },
    {
      path: '/targyi-eszkoz',
      props: { app: 'targyi-eszkoz' },
      component: VirMenu
    },
    {
      path: '/targyi-eszkoz-info',
      component: () => import(/* webpackChunkName: "info" */ './views/targyi-eszkoz/Info.vue')
    },
    {
      path: '/targyi-eszkoz-athelyezes',
      component: () => import(/* webpackChunkName: "athelyezes" */ './views/targyi-eszkoz/Athelyezes.vue')
    },
    {
      path: '/targyi-eszkoz-erkeztetes',
      props: { sztorno: false },
      component: () => import(/* webpackChunkName: "erkeztetes" */ './views/targyi-eszkoz/Erkeztetes.vue')
    },
    {
      path: '/targyi-eszkoz-sztornozas',
      props: { sztorno: true },
      component: () => import(/* webpackChunkName: "erkeztetes" */ './views/targyi-eszkoz/Erkeztetes.vue')
    },
    {
      path: '/targyi-eszkoz-szemelynek',
      component: () => import(/* webpackChunkName: "szemelynek" */ './views/targyi-eszkoz/Szemelynek.vue')
    },
    {
      path: '/targyi-eszkoz-leltar',
      component: () => import(/* webpackChunkName: "leltar" */ './views/targyi-eszkoz/Leltar.vue')
    }
  ]
})
