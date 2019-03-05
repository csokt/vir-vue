<template>
  <v-container pa-0>
    <v-layout justify-space-around wrap>
      <BaseCard>
        <BaseMenu :items="showItems"/>
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
  name: 'tablazat',
  components: {
    BaseCard,
    BaseMenu
  },

  computed: {
    ...get(['user']),

    showItems () {
      const items = [
        { show: true, path: '/table/napikodolas', title: 'Mai napi kódolások' },
        { show: true, path: '/table/havikodolas', title: 'Aktuális havi kódolások' }
      ]
      return items.filter(item => item.show)
    }
  },

  created () {
    this.$store.set('pageTitle', 'Táblázatok')
  }
}
</script>
