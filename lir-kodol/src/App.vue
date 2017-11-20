<template>
  <div id="app">
<!--
    <router-link to="/">Home</router-link>
    <router-link to="/kodol">Teljesítmény kódolás</router-link>
    <router-link to="/teszt" >Teszt</router-link>
-->
    <router-view></router-view>
  </div>
</template>

<script>
import odoo from './odoo-jsonrpc'
import {store} from './store'
export default {
  name: 'app',
  data () {
    return {
      store: store
    }
  },

// /////////////////////////////////////////////////////////////////////////
//
//                               odoo
//
// /////////////////////////////////////////////////////////////////////////
  created: function () {
    let self = this
    odoo.setHost('.')
    const db = this.$route.query.db || 'szefo'
    odoo.login(db, 'frontend', 'Szefo1953').then(
      function (result) {
        self.store.odooConnected = true
        self.store.odooError = ''
      },
      function (error) {
        self.store.odooError = 'Nincs kapcsolat az adatbázissal!'
        console.error(error)
      }
    )
  }
}
</script>

<style>
#app {
  margin: 1em;
}
</style>
