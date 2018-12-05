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
            :parentSearch="leltariv.name"
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
import BaseKorzetInfo from '@/components/targyi-eszkoz/BaseKorzetInfo.vue'
import KorzetEszkozok from '@/components/targyi-eszkoz/KorzetEszkozok.vue'

export default {
  name: 'targyi-eszkoz-leltar',
  components: {
    BaseCard,
    BaseMenu,
    SmartAutocomplete,
    BaseKorzetInfo,
    KorzetEszkozok
  },

  data () {
    return {
      leltarivId: 0
    }
  },

  computed: {
    ...get(['leltariv']),

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

  methods: {
    apiUrl (content) {
      const params = { domain: [['name', 'ilike', content], ['state', '=', 'terv']], limit: 8 }
      return 'vir/searchRead/leltar.leltariv?params=' + JSON.stringify(params)
    }
  },

  created () {
    this.$store.set('pageTitle', 'Tárgyi eszköz leltár')
    this.leltarivId = this.leltariv.id
  }
}
</script>
