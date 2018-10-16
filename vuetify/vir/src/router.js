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
      component: Home
    },
    {
      path: '/te-info',
      component: () => import(/* webpackChunkName: "info" */ './views/targyi-eszkoz/Info.vue')
    },
    {
      path: '/te-athelyezes',
      component: () => import(/* webpackChunkName: "athelyezes" */ './views/targyi-eszkoz/Athelyezes.vue')
    },
    {
      path: '/te-erkeztetes',
      props: { sztorno: false },
      component: () => import(/* webpackChunkName: "erkeztetes" */ './views/targyi-eszkoz/Erkeztetes.vue')
    },
    {
      path: '/te-sztornozas',
      props: { sztorno: true },
      component: () => import(/* webpackChunkName: "erkeztetes" */ './views/targyi-eszkoz/Erkeztetes.vue')
    },
    {
      path: '/te-szemelynek',
      component: () => import(/* webpackChunkName: "szemelynek" */ './views/targyi-eszkoz/Szemelynek.vue')
    },
    {
      path: '/te-leltar',
      component: () => import(/* webpackChunkName: "leltar" */ './views/targyi-eszkoz/Leltar.vue')
    }
  ]
})
