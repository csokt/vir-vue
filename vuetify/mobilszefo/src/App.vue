<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" fixed app>
      <v-list>
        <v-list-tile v-for="item in menuItems" :key="item.title" :to="item.link">
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-side-icon v-if="store.rootPage" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-icon v-if="!store.rootPage" @click.stop="$router.go(-1)">arrow_back</v-icon>
      <v-toolbar-title v-text="store.pageTitle"></v-toolbar-title>
    </v-toolbar>

    <v-content>
      <h6 v-if="store.teszt" class="text-negative text-center">##### TESZT #####<hr></h6>
      <router-view/>
    </v-content>
  </v-app>
</template>


<script>
import Store from './store'
export default {
  name: 'App',
  data () {
    return {
      store: Store,

      drawer: null
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
      return this.store.fireUser !== null && this.store.fireUser !== undefined
    }
  }
}
</script>
