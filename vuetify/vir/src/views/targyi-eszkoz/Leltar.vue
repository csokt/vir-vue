<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <BaseCard>
        <v-card-text>
          <SmartAutocomplete
            v-model="leltarivId"
            label="Leltárív"
            itemClass="body-2"
            :apiUrl="apiUrl"
            @searchInput="searchInput = $event"
            @change="$store.set('leltariv', $event)"
          />
          <BaseMenu :items="showItems"/>
        </v-card-text>
      </BaseCard>
    </v-layout>
  </v-container>
</template>

<script>
import { get } from 'vuex-pathify'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseMenu from '@/components/base/BaseMenu.vue'
import SmartAutocomplete from '@/components/base/SmartAutocomplete.vue'

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
    ...get(['leltariv']),

    apiUrl () {
      const params = { domain: [['name', 'ilike', this.searchInput], ['state', '=', 'terv']], limit: 10 }
      return 'vir/searchRead/leltar.leltariv?params=' + JSON.stringify(params)
    },

    showItems () {
      if (!this.leltariv.id) return []
      const items = [
        { icon: 'add', title: 'Automatikus felvétel', path: '/targyi-eszkoz-leltar-felvetel-auto' },
        { icon: 'add', title: 'Kézi felvétel', path: '/targyi-eszkoz-leltar-felvetel-kezi' },
        { icon: 'edit', title: 'Selejtezés, sérült címke', path: '/targyi-eszkoz-leltar-eszkozadat' },
        { icon: 'edit', title: 'Ismeretlen eszközök', path: '/targyi-eszkoz-leltar-ismeretlen' },
        { icon: 'info', title: 'Fellelt tárgyi eszközök', path: '/targyi-eszkoz-leltar-leltariv-eszkoz-fellelt' },
        { icon: 'info', title: 'Hiányzó tárgyi eszközök', path: '/targyi-eszkoz-leltar-leltariv-eszkoz-hiany' }
      ]
      return items
    }
  },

  created () {
    this.$store.set('pageTitle', 'Tárgyi eszköz leltár')
    this.searchInput = this.leltariv.name
    this.leltarivId = this.leltariv.id
  }
}
</script>
