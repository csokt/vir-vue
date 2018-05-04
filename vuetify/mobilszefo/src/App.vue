<template>
  <v-app>

    <v-navigation-drawer
      app
      temporary
      :clipped="clipped"
      v-model="drawer"
      enable-resize-watcher
      fixed
    >
      <v-list>
        <v-list-tile
          v-for="item in menuItems"
          :key="item.title"
          :to="item.link">
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
      clipped-right
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-content>
      <h6 v-if="store.state.teszt" class="text-negative text-center">##### v1.1.1 TESZT #####<hr></h6>
      <router-view/>
    </v-content>

    <v-footer :fixed="fixed" app>
      <span>&copy; 2017</span>
    </v-footer>

  </v-app>
</template>

<script>
import Store from './store'
export default {
  name: 'App',
  data () {
    return {
      store: Store,

      clipped: true,
      drawer: false,
      items: [{
        icon: 'bubble_chart',
        title: 'Inspire'
      }],
      miniVariant: false,
      title: 'SZEFO mobil alkalmazások'
    }
  },
  computed: {
    menuItems () {
      let menuItems = [
        {icon: 'face', title: 'Sign up', link: '/signup'},
        {icon: 'lock_open', title: 'Sign in', link: '/signin'}
      ]
      if (this.userIsAuthenticated) {
        menuItems = [
          {icon: 'supervisor_account', title: 'View Meetups', link: '/meetups'},
          {icon: 'room', title: 'Organize Meetup', link: '/meetup/new'},
          {icon: 'person', title: 'Profile', link: '/profile'}
        ]
      }
      return menuItems
    },
    userIsAuthenticated () {
      return this.store.fireUser !== null && this.store.fireUser !== undefined
    }
  }
}
</script>
