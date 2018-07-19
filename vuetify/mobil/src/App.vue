<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/login">Login</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { getUser, getVirUser } from '@/backend/rest.js'
import Store from '@/store'

export default {
  name: 'app',
  data () {
    return {
      store: Store
    }
  },

  computed: {
    menuItems () {
      let menuItems = [
        {icon: 'help', title: 'Segítség', link: '/help'}
      ]
      if (this.userIsAuthenticated) {
        menuItems = [
          {icon: 'person', title: 'Profile', link: '/profile'},
          {icon: 'help', title: 'Segítség', link: '/help'}
        ]
      }
      return menuItems
    },
    userIsAuthenticated () {
      return this.store.user !== null && this.store.user !== undefined
    }
  },

  methods: {
  },

  created () {
    window.oncontextmenu = function (event) {
      event.preventDefault()
      event.stopPropagation()
      return false
    }

    console.log('token', localStorage.szefo_loopback_token)
    getUser(this.$router)
    getVirUser()
  }

}
</script>

<style lang="stylus">
#app
  text-align center
  font-size 2em
</style>
