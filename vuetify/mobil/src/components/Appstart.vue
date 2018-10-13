<template>
  <Card>
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
    <v-card-actions v-if="showAdmin">
      <v-btn color="primary" @click="addUsers">Új felhasználók a VIR személyekből.</v-btn>
<!--
      <v-btn color="primary" @click="restartBackend">Restart backend</v-btn>
-->
    </v-card-actions>
  </Card>
</template>

<script>
import { API, EventBus } from '@/util.js'
import Card from '@/components/base/Card.vue'
import Store from '@/store'

export default {
  name: 'appstart',
  components: {
    Card
  },

  data: () => ({
    store: Store
  }),

  computed: {
    showAdmin () {
      return this.store.user.main_role === 'admin'
    },

    isLoggedIn () {
      return !!this.store.user
    },

    showTV () {
      return !!this.store.user.tv_role
    },

    showTir () {
      return ['admin'].includes(this.store.user.main_role) || !!(this.store.user && this.store.user.tir_azonosito)
    },

    showVir () {
      return this.store.virUser
    },

    isLeltarUser () {
      return this.store.virUser && this.store.virUser.groups_id.includes(19)
    },

    isChanceUser () {
      return this.store.virUser && this.store.virUser.groups_id.includes(58)
    },

    isLegrandUser () {
      return this.store.virUser && this.store.virUser.groups_id.includes(67)
    },

    apps () {
      return [
        { show: this.store.teszt, title: 'Teszt program', avatar: '/favicon.ico', href: 'https://tibor.szefo.local:9443' },
        { show: this.showTV, title: 'TV távvezérlés', avatar: '/tv-remote.png', href: 'https://mobilszefo.hopto.org:19531' },
        { show: this.showTir, title: 'Termelés Információs Rendszer', avatar: '/tir.png', href: 'https://mobilszefo.hopto.org:19532' },
        { show: this.showVir, title: 'Vállalat Irányítási Rendszer', avatar: '/vir.png', href: 'https://mobilszefo.hopto.org:19533' },
        { show: this.isLegrandUser, title: 'Legrand készlet', avatar: '/legrand.png', href: 'https://lir-keszlet.szefo.local' },
        { show: this.isChanceUser, title: 'Chance készlet', avatar: '/chance.png', href: 'https://chance-keszlet.szefo.local' },
        { show: this.isLoggedIn, title: 'Tárgyi eszköz információk', avatar: '/eszkozinfo.png', href: 'https://mobilszefo.hopto.org:19538' }
      ]
    },

    showApps () {
      return this.apps.filter(o => o.show)
    }
  },

  methods: {
    async restartBackend () {
      const response = await API.post('config/restart')
      if (response.ok) {
        EventBus.$emit('inform', { type: 'alert', variation: 'info', message: 'Backend restarted' })
      } else {
        EventBus.$emit('inform', { type: 'alert', variation: 'error', message: response.problem })
      }
    },

    async start (href) {
      const token = { loopback_token: localStorage.szefo_loopback_token, user: this.store.user, vir_user: this.store.virUser }
      const response = await API.post('accounts/pushtoken', token)
      if (response.ok) {
        const path = href + '?token_uid=' + response.data
        window.location.href = path
      } else {
        EventBus.$emit('inform', { type: 'alert', variation: 'error', message: response.problem })
      }
    },

    async addUsers () {
      const response = await API.post('accounts/createusers')
      if (response.ok) {
        EventBus.$emit('inform', { type: 'alert', variation: 'info', message: 'Új felhasználók létrehozva' })
      } else {
        EventBus.$emit('inform', { type: 'alert', variation: 'error', message: response.problem })
      }
    }
  }
}
</script>
