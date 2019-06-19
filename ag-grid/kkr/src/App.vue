<template>
  <router-view/>
</template>

<script>
import { API } from '@/util'

export default {
  name: 'App',

  methods: {
    async getUser (token) {
      if (token) {
        const response = await API.post('accounts/pulltoken/' + token)
        if (response.ok) {
          API.setHeader('Authorization', response.data.loopback_token)
        }
      } else {
        const response = await API.post('tir/login')
        if (response.ok) {
          API.setHeader('Authorization', response.data.id)
        }
      }
      this.$router.replace('/')
    }
  },

  created () {
    this.getUser(this.$route.query.token_uid)
  },

  mounted () {
    // console.log('NODE_ENV', process.env.NODE_ENV)
    // console.log('breakpoint', this.$vuetify.breakpoint)
    window.oncontextmenu = function (event) {
      event.preventDefault()
      event.stopPropagation()
      return false
    }
  }
}
</script>

<style lang="scss">
  @import "../node_modules/ag-grid-community/dist/styles/ag-grid.css";
  @import "../node_modules/ag-grid-community/dist/styles/ag-theme-balham.css";
</style>
