<template>
  <v-app id="szefo">
    <v-toolbar color="indigo" dark fixed app>
      <v-icon v-if="$route.path !== '/'" @click.stop="$router.go(-1)">arrow_back</v-icon>
      <v-toolbar-title v-text="store.pageTitle"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="$route.path === '/'" icon @click="$router.push('help')" > <v-icon>help</v-icon> </v-btn>
      <v-btn v-if="$route.path === '/'" icon @click="$router.push('setup')" > <v-icon>settings</v-icon> </v-btn>
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
      return this.store.fireUser !== null && this.store.fireUser !== undefined
    }
  }
}
</script>
