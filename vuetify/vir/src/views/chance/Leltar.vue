<template>
  <v-container pa-0>
    <v-layout justify-space-around wrap>
      <BaseCard>
        <v-card-text>
          <SmartAutocomplete
            v-model="leltarivId"
            label="Leltárív"
            itemClass="body-2"
            :apiUrl="apiUrl"
            @searchInput="searchInput = $event"
            @change="$store.set('chanceiv', $event)"
          />
          <BaseMenu :items="showItems"/>
        </v-card-text>
      </BaseCard>
    </v-layout>
  </v-container>
</template>

<script>
import { get } from 'vuex-pathify'
import BaseCard from '@/components/core/BaseCard.vue'
import BaseMenu from '@/components/core/BaseMenu.vue'
import SmartAutocomplete from '@/components/core/SmartAutocomplete.vue'

export default {
  name: 'targyi-eszkoz-leltar',
  components: {
    BaseCard,
    BaseMenu,
    SmartAutocomplete
  },

  data () {
    return {
      searchInput: '', // SmartAutocomplete
      leltarivId: 0 // SmartAutocomplete
    }
  },

  computed: {
    ...get(['chanceiv']),

    apiUrl () {
      const params = { domain: [['name', 'ilike', this.searchInput], ['state', '=', 'terv']], limit: 10 }
      return 'vir/searchRead/chance.leltariv?params=' + JSON.stringify(params)
    },

    showItems () {
      if (!this.chanceiv.id) return []
      const items = [
        { icon: 'add', title: 'Automatikus felvétel', path: '/chance-leltar-felvetel-auto' },
        { icon: 'add', title: 'Kézi felvétel', path: '/chance-leltar-felvetel-kezi' }
      ]
      return items
    }
  },

  created () {
    this.$store.set('pageTitle', 'Chance leltár')
    this.searchInput = this.chanceiv.name
    this.leltarivId = this.chanceiv.id
  }
}
</script>
