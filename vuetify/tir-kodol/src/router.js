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
      path: '/munkalap',
      component: () => import(/* webpackChunkName: "munkalap" */ './views/Munkalap.vue')
    },
    {
      path: '/seasearch',
      component: () => import(/* webpackChunkName: "seasearch" */ './views/Seasearch.vue')
    },
    {
      path: '/norma',
      component: () => import(/* webpackChunkName: "norma" */ './views/Norma.vue')
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
    }
  ]
})
