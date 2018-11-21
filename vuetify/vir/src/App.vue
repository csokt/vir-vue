<template>
  <v-app>
    <v-toolbar color="blue darken-1" dark app>
      <v-icon @click.stop="$router.go(-1)">
        arrow_back
      </v-icon>
      <v-spacer></v-spacer>
      <v-toolbar-title v-text="this.pageTitle"></v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>

    <v-footer app height=36 color="grey lighten-3" fixed>
      <v-layout column>
        <Inform/>
        <div style="text-align: center;">
          <span>
            {{user.name}}
            {{version}}
          </span>
        </div>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import { get } from 'vuex-pathify'
import { API, EventBus } from '@/util'
import Menu from '@/components/base/Menu.vue'
import Inform from '@/components/base/Inform.vue'

export default {
  name: 'App',
  components: {
    Menu,
    Inform
  },

  data () {
    return {
    }
  },

  computed: {
    ...get(['version', 'pageTitle', 'menuLevel', 'appPageTitle', 'modulePageTitle', 'user']),

    title () {
      return this.pageTitle
    }
  },

  methods: {
    async getUser (token) {
      if (token) {
        const response = await API.post('accounts/pulltoken/' + token)
        if (response.ok) {
          this.$store.commit('user', response.data.vir_user)
          API.setHeader('Authorization', response.data.loopback_token)
          return
        } else {
          console.log(response.problem)
        }
      }
      EventBus.$emit('inform', { type: 'alert', variation: 'error', message: 'Érvénytelen felhasználó!' })
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

<style lang="stylus">
table.v-table
  thead, tbody
    td, th
      &:not(:nth-child(1)), &:first-child
        padding: 0 1px

  tfoot
    tr
      td
        padding: 0 1px
</style>
