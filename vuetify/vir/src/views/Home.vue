<template>
  <v-container>
    <v-layout justify-space-around wrap>
      <Card v-if="user.id" elevation="elevation-1">
        <Menu :items="showApps" @select="select($event)"/>
      </Card>
      <Card v-if="!user.id" title="Kérem jelentkezzen be!">
      </Card>
    </v-layout>
  </v-container>
<!--
      <Card v-if="user.id" elevation="elevation-1" :title="'Üdvözlöm ' + user.name + '!'">
      <v-btn color="primary" @click="restartBackend">Restart backend</v-btn>
-->
</template>

<script>
import { get } from 'vuex-pathify'
import { groupId } from '@/util.js'
import Card from '@/components/base/Card.vue'
import Menu from '@/components/base/Menu.vue'

export default {
  name: 'home',
  components: {
    Card,
    Menu
  },

  computed: {
    ...get(['menuLevel', 'appSelectTrigger', 'user']),

    showApps () {
      if (!this.user.id) return []
      const apps = [
        { groupId: groupId.LegrandViewer, title: 'Legrand', avatar: '/legrand.png', app: 'legrand' },
        { groupId: groupId.ChanceViewer, title: 'Chance', avatar: '/chance.png', app: 'chance' },
        { groupId: groupId.LeltarViewer, title: 'Tárgyi eszköz', avatar: '/eszkoz.png', app: 'leltar' }
      ]
      return apps.filter(app => this.user.groups_id.includes(app.groupId))
    }
  },

  methods: {
    select (item) {
      this.$store.set('app', item.app)
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
