import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Grid from './views/Grid.vue'

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
      path: '/grid/:id',
      name: 'grid',
      component: Grid
    },
    {
      path: '/data/:id',
      props: { isData: true },
      name: 'data',
      component: Grid
    },
    {
      path: '/sql/:id',
      props: { isSql: true },
      name: 'sql',
      component: Grid
    }
  ]
})
