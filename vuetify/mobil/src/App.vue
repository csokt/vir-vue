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
      <h1 v-if="store.teszt" style="text-align: center">##### TESZT #####<hr></h1>
      <router-view/>
    </v-content>
    <v-footer app height=36 color="grey lighten-3" >
      <v-layout column>
        <Inform/>
        <div style="text-align: center;">
          <span>
            {{store.user && store.user.name}}
            {{store.version}}
          </span>
        </div>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import { API } from '@/backend/rest.js'
// import { EventBus } from '@/util.js'
import Inform from '@/components/Inform.vue'
import { getUser, getVirUser } from '@/util.js'
import Store from '@/store'

export default {
  name: 'app',
  data () {
    return {
      store: Store
    }
  },

  components: {
    Inform
  },

  async created () {
    window.oncontextmenu = function (event) {
      event.preventDefault()
      event.stopPropagation()
      return false
    }
    this.store.teszt = await API.get('config/nodeEnv').data !== 'production'
    getUser(this, '/setup')
    getVirUser(this)
  }
}
</script>
