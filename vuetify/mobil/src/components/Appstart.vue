<template>
  <div>
    <h3>{{ msg }}</h3>
    <ol>
      <li v-for="app in showApps" v-bind:key="app.title" @click="start(app.href)">
        {{ app.title }}
      </li>
    </ol>
  </div>
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
        { show: this.showTV, title: 'TV távvezérlés', avatar: '/static/dama.png', href: 'http://localhost:9000/#/' },
        { show: this.showTir, title: 'Termelés Inf. Rendszer', avatar: '/static/dama.png', href: 'https://tir.szefo.local' },
        { show: this.showVir, title: 'Legrand készlet', avatar: '/static/legrand.png', href: 'https://lir-keszlet.szefo.local' },
        { show: this.showVir, title: 'Chance készlet', avatar: '/static/chance.png', href: 'https://chance-keszlet.szefo.local' },
        { show: this.showVir, title: 'Tárgyi eszköz', avatar: '/static/eszkoz.png', href: 'https://eszkozinfo.szefo.local' }
      ]
    },

    showApps () {
      return this.apps.filter(o => o.show)
    }
  },

  methods: {
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
