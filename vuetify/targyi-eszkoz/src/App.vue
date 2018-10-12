<template>
  <v-app>
    <v-navigation-drawer
      persistent
      :clipped="clipped"
      v-model="drawer"
      enable-resize-watcher
      fixed
      app
    >
      <v-list v-if="user.id">
        <v-list-tile
          value="true"
          v-for="(item, i) in items"
          :key="i"
          @click.stop="$router.replace(item.path)"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      app
      :clipped-left="clipped"
      color="blue darken-1"
      dark
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-spacer></v-spacer>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>

    <v-footer app height=36 color="grey lighten-3" :fixed="fixed">
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
import Inform from '@/components/base/Inform.vue'
import { API, EventBus } from '@/util'

export default {
  name: 'App',
  components: {
    Inform
  },

  data () {
    return {
      clipped: true,
      drawer: false,
      fixed: true,
      items: [
        { icon: 'info', title: 'Tárgyi eszköz információk', path: '/info' },
        { icon: 'exit_to_app', title: 'Tárgyi eszköz áthelyezés', path: '/athelyezes' },
        { icon: 'done', title: 'Tárgyi eszköz érkeztetés', path: '/erkeztetes' },
        { icon: 'stop', title: 'Tárgyi eszköz sztornózás', path: '/sztornozas' },
        { icon: 'assignment', title: 'Tárgyi eszköz leltár', path: '/leltar' }
      ]
    }
  },

  computed: get(['title', 'user', 'version']),

  methods: {
    async getUser (token) {
      if (token) {
        const response = await API.post('accounts/pulltoken/' + token)
        if (response.ok) {
          this.$store.commit('user', response.data.user)
          API.setHeader('Authorization', response.data.loopback_token)
          this.drawer = true
          return
        } else {
          console.log(response.problem)
        }
      }
      EventBus.$emit('inform', { type: 'alert', variation: 'error', message: 'Érvénytelen felhasználó!' })
      this.$router.replace('/')
    }
  },

  // created () {
  mounted () {
    // console.log('NODE_ENV', process.env.NODE_ENV)
    // console.log('breakpoint', this.$vuetify.breakpoint)
    window.oncontextmenu = function (event) {
      event.preventDefault()
      event.stopPropagation()
      return false
    }
    this.getUser(this.$route.query.token_uid)
  }
}
</script>
