<template>
  <v-container>
    <v-layout justify-space-around>
      <Card v-if="user.id" :title="'Üdvözlöm ' + user.name + '!'">
        <v-list>
          <template v-for="(item, index) in showApps">
          <v-list-tile :key="item.title" avatar @click="select(item)">
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
      </Card>
      <Card v-if="!user.id" title="Kérem jelentkezzen be!">
      </Card>
    </v-layout>
  </v-container>
<!--
      <v-btn color="primary" @click="restartBackend">Restart backend</v-btn>
-->
</template>

<script>
import { get } from 'vuex-pathify'
// import { API, EventBus } from '@/util.js'
import Card from '@/components/base/Card.vue'

export default {
  name: 'home',
  components: {
    Card
  },

  computed: {
    ...get(['menuLevel', 'appSelectTrigger', 'user']),

    isLeltarViewer () {
      return this.user && this.user.groups_id.includes(18) && !this.user.groups_id.includes(19)
    },

    isLeltarUser () {
      return this.user && this.user.groups_id.includes(19)
    },

    isChanceViewer () {
      return this.user && this.user.groups_id.includes(57) && !this.user.groups_id.includes(58)
    },

    isChanceUser () {
      return this.user && this.user.groups_id.includes(58)
    },

    isLegrandViewer () {
      return this.user && this.user.groups_id.includes(66) && !this.user.groups_id.includes(67)
    },

    isLegrandUser () {
      return this.user && this.user.groups_id.includes(67)
    },

    apps () {
      return [
        { show: this.isLegrandViewer, title: 'Legrand', avatar: '/legrand.png', app: 'legrand', role: 'viewer' },
        { show: this.isChanceViewer, title: 'Chance', avatar: '/chance.png', app: 'chance', role: 'viewer' },
        { show: this.isLeltarViewer, title: 'Tárgyi eszköz', avatar: '/eszkoz.png', app: 'leltar', role: 'viewer' },
        { show: this.isLegrandUser, title: 'Legrand', avatar: '/legrand.png', app: 'legrand', role: 'user' },
        { show: this.isChanceUser, title: 'Chance', avatar: '/chance.png', app: 'chance', role: 'user' },
        { show: this.isLeltarUser, title: 'Tárgyi eszköz', avatar: '/eszkoz.png', app: 'leltar', role: 'user' }
      ]
    },

    showApps () {
      return this.apps.filter(o => o.show)
    }
  },

  methods: {
    select (item) {
      this.$store.set('app', item.app)
      this.$store.set('role', item.role)
      this.$store.set('homePageTitle', item.title)
      this.$store.set('menuLevel', 1)
      this.$store.set('appSelectTrigger', !this.appSelectTrigger)
    }
  },

  created () {
    if (this.menuLevel > 1) this.$store.set('menuLevel', 1)
  }
}
</script>
