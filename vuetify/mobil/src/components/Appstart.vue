<template>
  <v-flex xs12 sm8 md5>
    <v-card class="elevation-12">
      <v-list>
        <template v-for="(item, index) in showApps">
        <v-list-tile :key="item.title" avatar @click="start(item.href)">
          <v-list-tile-avatar tile>
            <img :src="item.avatar">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title v-html="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider v-if="index + 1 < showApps.length" inset :key="index"></v-divider>
        </template>
      </v-list>
    </v-card>
  </v-flex>
</template>

<script>
import { API } from '@/backend/rest.js'
import { EventBus } from '@/util.js'
import Store from '@/store'

export default {
  name: 'appstart',
  props: {
    msg: String
  },

  data: () => ({
    store: Store
  }),

  computed: {
    showTV () {
      return ['admin', 'manager'].includes(this.store.user.main_role)
    },

    showTir () {
      return ['admin'].includes(this.store.user.main_role) || !!(this.store.user && this.store.user.tir_azonosito)
    },

    showVir () {
      return !!this.store.virUser
    },

    apps () {
      return [
        { show: this.showTV, title: 'TV távvezérlés', avatar: '/tv-remote.png', href: 'http://tibor.szefo.local:90/#/' },
        { show: this.showTir, title: 'Termelés Inf. Rendszer', avatar: '/dama.png', href: 'https://tir.szefo.local' },
        { show: this.showVir, title: 'Legrand készlet', avatar: '/legrand.png', href: 'https://lir-keszlet.szefo.local' },
        { show: this.showVir, title: 'Chance készlet', avatar: '/chance.png', href: 'https://chance-keszlet.szefo.local' },
        { show: this.showVir, title: 'Tárgyi eszköz', avatar: '/eszkoz.png', href: 'https://eszkozinfo.szefo.local' }
      ]
    },

    showApps () {
      return this.apps.filter(o => o.show)
    }
  },

  methods: {
    teszt () {
      console.log('Teszt')
    },

    async start (href) {
      const token = {loopback_token: localStorage.szefo_loopback_token}
      const response = await API.post('accounts/pushtoken', token)
      if (response.ok) {
        const path = href + '?token_uid=' + response.data
        window.location.href = path
      } else {
        EventBus.$emit('inform', {type: 'alert', variation: 'error', message: response.problem})
      }
    }
  },

  created () {
  }
}
</script>
