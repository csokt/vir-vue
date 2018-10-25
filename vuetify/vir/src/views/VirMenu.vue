<template>
  <v-container>
    <v-layout justify-space-around wrap>
      <Card elevation="elevation-1">
        <Menu :items="showItems" @select="select($event)"/>
      </Card>
    </v-layout>
  </v-container>
<!--
-->
</template>

<script>
import { get } from 'vuex-pathify'
import { groupId } from '@/util.js'
import Card from '@/components/base/Card.vue'
import Menu from '@/components/base/Menu.vue'

export default {
  name: 'virmenu',
  components: {
    Card,
    Menu
  },

  props: {
    app: String
  },

  computed: {
    ...get(['user']),

    showItems () {
      const items = [
        { groupId: groupId.LegrandViewer, app: 'legrand', path: '/targyi-eszkoz-info', icon: 'info', title: 'Legrand információk' },
        { groupId: groupId.ChanceViewer, app: 'chance', path: '/targyi-eszkoz-info', icon: 'info', title: 'Chance információk' },
        { groupId: groupId.LeltarViewer, app: 'targyi-eszkoz', path: '/targyi-eszkoz-info', icon: 'info', title: 'Tárgyi eszköz információk' },
        { groupId: groupId.LeltarUser, app: 'targyi-eszkoz', path: '/targyi-eszkoz-athelyezes', icon: 'exit_to_app', title: 'Tárgyi eszköz áthelyezés' },
        { groupId: groupId.LeltarUser, app: 'targyi-eszkoz', path: '/targyi-eszkoz-erkeztetes', icon: 'done', title: 'Tárgyi eszköz érkeztetés' },
        { groupId: groupId.LeltarUser, app: 'targyi-eszkoz', path: '/targyi-eszkoz-sztornozas', icon: 'stop', title: 'Tárgyi eszköz sztornózás' },
        { groupId: groupId.LeltarUser, app: 'targyi-eszkoz', path: '/targyi-eszkoz-szemelynek', icon: 'person', title: 'Személyes használatra' },
        { groupId: groupId.LeltarUser, app: 'targyi-eszkoz', path: '/targyi-eszkoz-leltar', icon: 'assignment', title: 'Tárgyi eszköz leltár' }
      ]
      return items.filter(item => item.app === this.app && this.user.groups_id.includes(item.groupId))
    }
  },

  methods: {
    select (item) {
      this.$store.set('modulePageTitle', item.title)
      this.$store.set('menuLevel', 2)
    }
  },

  created () {
    this.$store.set('menuLevel', 1)
  }
}
</script>
