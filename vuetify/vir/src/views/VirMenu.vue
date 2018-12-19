<template>
  <v-container>
    <v-layout justify-space-around wrap>
      <BaseCard elevation="elevation-1">
        <BaseMenu :items="showItems"/>
      </BaseCard>
    </v-layout>
  </v-container>
</template>

<script>
import { get } from 'vuex-pathify'
import { groupId } from '@/util.js'
import BaseCard from '@/components/core/BaseCard.vue'
import BaseMenu from '@/components/core/BaseMenu.vue'

export default {
  name: 'virmenu',
  components: {
    BaseCard,
    BaseMenu
  },

  props: {
    app: String
  },

  computed: {
    ...get(['user']),

    showItems () {
      const items = [
        { groupId: groupId.LegrandViewer, app: 'legrand', path: '/legrand-cikkinfo', icon: 'info', title: 'Termék információk' },
        { groupId: groupId.LegrandUser, app: 'legrand', path: '/legrand-muveletvegzes', icon: 'work', title: 'Műveletvégzés' },
        { groupId: groupId.ChanceViewer, app: 'chance', path: '/chance-cikkinfo', icon: 'info', title: 'Termék információk' },
        { groupId: groupId.ChanceViewer, app: 'chance', path: '/chance-keszlet', icon: 'info', title: 'Készlet információk' },
        { groupId: groupId.LeltarViewer, app: 'targyi-eszkoz', path: '/targyi-eszkoz-info', icon: 'info', title: 'Tárgyi eszköz információk' },
        { groupId: groupId.LeltarViewer, app: 'targyi-eszkoz', path: '/targyi-eszkoz-leltarkorzet', icon: 'info', title: 'Leltárkörzet információk' },
        { groupId: groupId.LeltarUser, app: 'targyi-eszkoz', path: '/targyi-eszkoz-athelyezes', icon: 'exit_to_app', title: 'Tárgyi eszköz áthelyezés' },
        { groupId: groupId.LeltarUser, app: 'targyi-eszkoz', path: '/targyi-eszkoz-erkeztetes', icon: 'done', title: 'Tárgyi eszköz érkeztetés' },
        { groupId: groupId.LeltarUser, app: 'targyi-eszkoz', path: '/targyi-eszkoz-sztornozas', icon: 'stop', title: 'Tárgyi eszköz sztornózás' },
        { groupId: groupId.LeltarUser, app: 'targyi-eszkoz', path: '/targyi-eszkoz-szemelynek', icon: 'person', title: 'Személyes használatra' },
        { groupId: groupId.LeltarUser, app: 'targyi-eszkoz', path: '/targyi-eszkoz-leltar', icon: 'assignment', title: 'Tárgyi eszköz leltár' }
      ]
      return items.filter(item => item.app === this.app && this.user.groups_id.includes(item.groupId))
    }
  },

  created () {
    const titles = {
      legrand: 'Legrand',
      chance: 'Chance',
      'targyi-eszkoz': 'Tárgyi eszköz'
    }
    this.$store.set('pageTitle', titles[this.app])
  }
}
</script>
