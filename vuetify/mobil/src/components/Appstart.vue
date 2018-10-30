<template>
  <Card elevation="elevation-1">
    <Menu :items="showApps" @select="start($event.href)"/>
    <v-card-actions v-if="showAdmin">
      <v-btn color="primary" @click="addUsers">Új felhasználók a VIR személyekből.</v-btn>
    </v-card-actions>
  </Card>
</template>

<script>
import { API, EventBus } from '@/util.js'
import Card from '@/components/base/Card.vue'
import Menu from '@/components/base/Menu.vue'
import Store from '@/store'

export default {
  name: 'appstart',
  components: {
    Card,
    Menu
  },

  data: () => ({
    store: Store
  }),

  computed: {
    showAdmin () {
      return this.store.user.main_role === 'admin'
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

    apps () {
      return [
        { show: this.store.teszt, title: 'Teszt program', avatar: '/favicon.ico', href: 'https://tibor.szefo.local:9443' },
        { show: this.showTV, title: 'TV távvezérlés', avatar: '/tv-remote.png', href: 'https://mobilszefo.hopto.org:19531' },
        { show: this.showTir, title: 'Termelés Információs Rendszer', avatar: '/tir.png', href: 'https://mobilszefo.hopto.org:19532' },
        { show: this.showVir, title: 'Vállalat Irányítási Rendszer', avatar: '/vir.png', href: 'https://mobilszefo.hopto.org:19533' }
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
