<template>
  <v-container pa-0>
    <v-layout justify-space-around wrap>
      <BaseCard v-if="user.id">
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
        { show: false, path: '/kodol', icon: 'info', title: 'Kódolás' },
        { show: false, path: '/atad', icon: 'info', title: 'Átadás' },
        { show: true, path: '/munkalap', icon: 'info', title: 'Munkalap információk' },
        { show: true, path: '/seasearch', icon: 'info', title: 'Dokumentációk' },
        { show: true, path: '/norma', icon: 'info', title: 'Mai teljesítmény %' },
        { show: true, path: '/tablazatok', icon: 'info', title: 'Táblázatok' }
      ]
      return items.filter(item => item.show)
    }
  },

  created () {
    this.$store.set('pageTitle', 'Termelés Információs Rendsz.')
  }
}
</script>
