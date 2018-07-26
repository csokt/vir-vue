<template>
  <v-app>
    <v-toolbar color="blue darken-1" dark app>
      <v-icon v-if="$route.path !== '/'" @click.stop="$router.go(-1)">arrow_back</v-icon>
      <v-toolbar-title v-text="store.pageTitle"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="$route.path === '/'" icon @click="$router.push('help')" > <v-icon>help</v-icon> </v-btn>
      <v-btn v-if="$route.path === '/'" icon @click="$router.push('setup')" > <v-icon>settings</v-icon> </v-btn>
    </v-toolbar>
    <v-content>
      <h6 v-if="store.teszt">##### TESZT #####<hr></h6>
      <router-view/>
    </v-content>
    <v-footer app height=7 color="grey lighten-3" >
      <v-layout column>
        <Inform/>
        <h6>
          {{store.user && store.user.name}}
          {{store.version}}
        </h6>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import Inform from '@/components/Inform.vue'
import { getUser, getVirUser } from '@/util.js'
import Store from '@/store'

export default {
  name: 'app',
  data () {
    return {
      store: Store,
      title: 'Vuetify.js'
    }
  },

  components: {
    Inform
  },

  mounted () {
    window.oncontextmenu = function (event) {
      event.preventDefault()
      event.stopPropagation()
      return false
    }

    console.log('token', localStorage.szefo_loopback_token)
    getUser(this, '/setup')
    getVirUser(this)
  }

}
</script>

<style lang="stylus">
#app
  text-align center
  font-size 2em
</style>
