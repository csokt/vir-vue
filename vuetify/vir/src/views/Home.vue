<template>
  <v-container pa-0>
    <v-layout justify-space-around wrap>
      <BaseCard
        v-if="user.id"
      >
        <BaseMenu :items="showItems"/>
      </BaseCard>

      <BaseCard
        v-if="!user.id"
        title="Kérem jelentkezzen be!"
      >
      </BaseCard>
    </v-layout>
  </v-container>
<!--
      <v-btn color="primary" @click="restartBackend">Restart backend</v-btn>
-->
</template>

<script>
import { get } from 'vuex-pathify'
import { groupId } from '@/util.js'
import BaseCard from '@/components/core/BaseCard.vue'
import BaseMenu from '@/components/core/BaseMenu.vue'

export default {
  name: 'home',
  components: {
    BaseCard,
    BaseMenu
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
