<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <BaseCard :title="leltariv.name">
        <v-card-text>
          <LeltarivEszkozok
            :filter="filter"
            :leltarivId="leltariv.id"
          />
        </v-card-text>
      </BaseCard>
    </v-layout>
  </v-container>
</template>

<script>
import { get } from 'vuex-pathify'
import BaseCard from '@/components/core/BaseCard.vue'
import LeltarivEszkozok from '@/components/targyi-eszkoz/LeltarivEszkozok.vue'

export default {
  name: 'targyi-eszkoz-leltar-leltariv-eszkoz',
  components: {
    BaseCard,
    LeltarivEszkozok
  },

  props: {
    filter: String
  },

  computed: {
    ...get(['leltariv'])
  },

  created () {
    let title = '????? tárgyi eszközök'
    if (this.filter === 'fellelt') title = 'Fellelt tárgyi eszközök'
    if (this.filter === 'hiany') title = 'Hiányzó tárgyi eszközök'
    this.$store.set('pageTitle', title)
  }
}
</script>
