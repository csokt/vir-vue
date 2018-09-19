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
      <v-list>
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
import Inform from '@/components/Inform.vue'

export default {
  name: 'App',
  data () {
    return {
      clipped: true,
      drawer: true,
      fixed: true,
      items: [
        { icon: 'info', title: 'Tárgyi eszköz információk', path: '/info' },
        { icon: 'exit_to_app', title: 'Tárgyi eszköz áthelyezés', path: '/athelyezes' },
        { icon: 'done', title: 'Tárgyi eszköz érkeztetés', path: '/erkeztetes' },
        { icon: 'assignment', title: 'Tárgyi eszköz leltár', path: '/leltar' }
      ]
    }
  },

  computed: get(['title', 'user', 'version']),

  components: {
    Inform
  },

  created () {
    console.log('NODE_ENV', process.env.NODE_ENV)
    window.oncontextmenu = function (event) {
      event.preventDefault()
      event.stopPropagation()
      return false
    }
    this.$store.dispatch('getUser', this.$route.query.token_uid)

    // if (this.$route.query.token_uid) {
    //   const response = await API.post('accounts/pulltoken/' + this.$route.query.token_uid)
    //   if (response.ok) {
    //     this.store.user = response.data.user
    //     API.setHeader('Authorization', response.data.loopback_token)
    //   } else {
    //     console.log(response.problem)
    //   }
    // }
  }
}
</script>
