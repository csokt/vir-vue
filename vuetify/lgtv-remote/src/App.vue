<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
import API from '@/rest.js'

export default {
  name: 'app',
  data () {
    return {
    }
  },

  methods: {
  },

  async created () {
    window.oncontextmenu = function (event) {
      event.preventDefault()
      event.stopPropagation()
      return false
    }

    if (this.$route.query.token_uid) {
      const response = await API.post('accounts/pulltoken/' + this.$route.query.token_uid)
      if (response.ok) {
        API.setHeader('Authorization', response.data.loopback_token)
      } else {
        console.log(response.problem)
      }
    }
  }
}
</script>

<style lang="stylus">
#app
  text-align center
  font-size 2em
</style>
