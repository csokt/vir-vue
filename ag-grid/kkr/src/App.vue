<template>
  <router-view/>
</template>

<script>
import Store from '@/store'
import { API } from '@/util'

export default {
  name: 'App',

  data () {
    return {
      store: Store
    }
  },

  methods: {
    async getUser (token) {
      if (token) {
        const response = await API.post('accounts/pulltoken/' + token)
        if (response.ok) {
          API.setHeader('Authorization', response.data.loopback_token)
          this.store.loggedIn = true
        }
      } else {
        const response = await API.post('tir/login')
        if (response.ok) {
          API.setHeader('Authorization', response.data.id)
          this.store.loggedIn = true
        }
      }
      // this.$router.replace('/')
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

.row-class-header {
    background: darkgrey !important;
    font-weight: bold;
}

.div-percent-bar {
    display: inline-block;
    height: 100%;
    position: absolute;
}

.div-percent-value {
    position: absolute;
    padding-left: 4px;
    font-weight: bold;
    font-size: 13px;
}

.div-outer-div {
    display: inline-block;
    height: 100%;
    width: 100%;
}
</style>
