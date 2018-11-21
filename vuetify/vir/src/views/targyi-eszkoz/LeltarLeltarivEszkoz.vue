<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <Card :title="leltariv.name">
        <v-card-text>
          <LeltarivEszkozok :filter="filter" :leltarivId="leltariv.id"/>
        </v-card-text>
      </Card>
    </v-layout>
  </v-container>
</template>

<script>
import { get } from 'vuex-pathify'
import Card from '@/components/base/Card.vue'
import LeltarivEszkozok from '@/components/targyi-eszkoz/LeltarivEszkozok.vue'

export default {
  name: 'targyi-eszkoz-leltar-leltariv-eszkoz',
  components: {
    Card,
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
