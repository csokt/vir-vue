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
          v-for="(item, i) in showItems"
          :key="i"
          @click.stop="selectItem(item)"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile
          value="true"
          @click.stop="drawer = false"
        >
          <v-list-tile-action>
            <v-icon>first_page</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Menü bezárása</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile
          value="true"
          @click.stop="$router.go(-1)"
        >
          <v-list-tile-action>
            <v-icon>arrow_back</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Kilépés</v-list-tile-title>
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
      <v-toolbar-side-icon
        v-if="menuLevel === 1"
        @click.stop="drawer = !drawer">
      </v-toolbar-side-icon>
      <v-icon
        v-if="menuLevel === 2"
        @click.stop="$router.go(-1)"
      >
        arrow_back
      </v-icon>
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
      fixed: true
    }
  },

  computed: {
    ...get(['version', 'menuLevel', 'homePageTitle', 'modulePageTitle', 'appSelectTrigger', 'app', 'role', 'user']),

    title () {
      if (this.menuLevel === 0) return 'Vállalat Irányítási Rendszer'
      if (this.menuLevel === 1) return this.homePageTitle
      return this.modulePageTitle
    },

    showItems () {
      const items = [
        { app: 'legrand', role: 'viewer', path: '/te-info', icon: 'info', title: 'Legrand információk' },
        { app: 'chance', role: 'viewer', path: '/te-info', icon: 'info', title: 'Chance információk' },
        { app: 'leltar', role: 'viewer', path: '/te-info', icon: 'info', title: 'Tárgyi eszköz információk' },
        { app: 'legrand', role: 'user', path: '/te-info', icon: 'info', title: 'Legrand információk' },
        { app: 'chance', role: 'user', path: '/te-info', icon: 'info', title: 'Chance információk' },
        { app: 'leltar', role: 'user', path: '/te-info', icon: 'info', title: 'Tárgyi eszköz információk' },
        { app: 'leltar', role: 'user', path: '/te-athelyezes', icon: 'exit_to_app', title: 'Tárgyi eszköz áthelyezés' },
        { app: 'leltar', role: 'user', path: '/te-erkeztetes', icon: 'done', title: 'Tárgyi eszköz érkeztetés' },
        { app: 'leltar', role: 'user', path: '/te-sztornozas', icon: 'stop', title: 'Tárgyi eszköz sztornózás' },
        { app: 'leltar', role: 'user', path: '/te-szemelynek', icon: 'person', title: 'Személyes használatra' },
        { app: 'leltar', role: 'user', path: '/te-leltar', icon: 'assignment', title: 'Tárgyi eszköz leltár' }
      ]
      return items.filter(o => o.app === this.app && o.role === this.role)
    }
  },

  watch: {
    menuLevel: function () {
      if (this.menuLevel === 1) this.drawer = true
    },
    appSelectTrigger: function () {
      if (this.menuLevel === 1) this.drawer = true
    },
    app: function () {
      if (this.menuLevel === 1) this.drawer = true
    }
  },

  methods: {
    selectItem (item) {
      this.drawer = false
      this.$store.set('modulePageTitle', item.title)
      this.$store.set('menuLevel', 2)
      this.$router.push(item.path)
    },

    async getUser (token) {
      if (token) {
        const response = await API.post('accounts/pulltoken/' + token)
        // console.log(response)
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
