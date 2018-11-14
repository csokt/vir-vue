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
      path: '/legrand-cikkinfo',
      component: () => import(/* webpackChunkName: "legrand-cikkinfo" */ './views/legrand/Info.vue')
    },
    {
      path: '/legrand-muveletvegzes',
      component: () => import(/* webpackChunkName: "legrand-muveletvegzes" */ './views/legrand/Muveletvegzes.vue')
    },
    {
      path: '/chance-cikkinfo',
      component: () => import(/* webpackChunkName: "chance-cikkinfo" */ './views/chance/Info.vue')
    },
    {
      path: '/chance-keszlet',
      component: () => import(/* webpackChunkName: "chance-keszlet" */ './views/chance/Keszlet.vue')
    },
    {
      path: '/targyi-eszkoz-info',
      component: () => import(/* webpackChunkName: "targyi-eszkoz-info" */ './views/targyi-eszkoz/Info.vue')
    },
    {
      path: '/targyi-eszkoz-athelyezes',
      component: () => import(/* webpackChunkName: "targyi-eszkoz-athelyezes" */ './views/targyi-eszkoz/Athelyezes.vue')
    },
    {
      path: '/targyi-eszkoz-erkeztetes',
      props: { sztorno: false },
      component: () => import(/* webpackChunkName: "targyi-eszkoz-erkeztetes" */ './views/targyi-eszkoz/Erkeztetes.vue')
    },
    {
      path: '/targyi-eszkoz-sztornozas',
      props: { sztorno: true },
      component: () => import(/* webpackChunkName: "targyi-eszkoz-sztornozas" */ './views/targyi-eszkoz/Erkeztetes.vue')
    },
    {
      path: '/targyi-eszkoz-szemelynek',
      component: () => import(/* webpackChunkName: "targyi-eszkoz-szemelynek" */ './views/targyi-eszkoz/Szemelynek.vue')
    },
    {
      path: '/targyi-eszkoz-leltarkorzet',
      component: () => import(/* webpackChunkName: "targyi-eszkoz-leltarkorzet" */ './views/targyi-eszkoz/Leltarkorzet.vue')
    },
    {
      path: '/targyi-eszkoz-leltar',
      component: () => import(/* webpackChunkName: "targyi-eszkoz-leltar" */ './views/targyi-eszkoz/Leltar.vue')
    }
  ]
})
