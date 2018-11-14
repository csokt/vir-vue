<template>
  <v-container>
    <v-layout justify-space-around wrap>
      <Card v-if="user.id" elevation="elevation-1">
        <Menu :items="showItems"/>
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
    ...get(['user']),

    showItems () {
      if (!this.user.id) return []
      const items = [
        { groupId: groupId.LegrandViewer, title: 'Legrand', avatar: '/legrand.png', path: '/legrand' },
        { groupId: groupId.ChanceViewer, title: 'Chance', avatar: '/chance.png', path: '/chance' },
        { groupId: groupId.LeltarViewer, title: 'Tárgyi eszköz', avatar: '/eszkoz.png', path: '/targyi-eszkoz' }
      ]
      return items.filter(item => this.user.groups_id.includes(item.groupId))
    }
  },

  created () {
    this.$store.set('pageTitle', 'Vállalat Irányítási Rendszer')
  }
}
</script>
