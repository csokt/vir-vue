<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <BaseCard>
        <v-card-text>
          <SmartAutocomplete
            v-model="leltarkorzetId"
            label="Leltárkörzet"
            itemClass="body-2"
            :apiUrl="apiUrl"
            @searchInput="searchInput = $event"
            @change="leltarkorzet = $event"
          />
          <BaseKorzetInfo :leltarkorzet="leltarkorzet"/>
        </v-card-text>
      </BaseCard>
      <BaseCard title="Tárgyi eszközök">
        <v-card-text>
          <KorzetEszkozok :leltarkorzetId="leltarkorzetId"/>
        </v-card-text>
      </BaseCard>
    </v-layout>
  </v-container>
</template>

<script>
import BaseCard from '@/components/base/BaseCard.vue'
import BaseKorzetInfo from '@/components/targyi-eszkoz/BaseKorzetInfo.vue'
import SmartAutocomplete from '@/components/base/SmartAutocomplete.vue'
import KorzetEszkozok from '@/components/targyi-eszkoz/KorzetEszkozok.vue'

export default {
  name: 'targyi-eszkoz-leltarkorzet',
  components: {
    BaseCard,
    BaseKorzetInfo,
    SmartAutocomplete,
    KorzetEszkozok
  },

  data () {
    return {
      searchInput: '',
      leltarkorzetId: 0,
      leltarkorzet: {}
    }
  },

  computed: {
    apiUrl () {
      const params = { domain: [['name', 'ilike', this.searchInput]], limit: 10 }
      return 'vir/searchRead/leltar.korzet?params=' + JSON.stringify(params)
    }
  },

  created () {
    this.$store.set('pageTitle', 'Leltárkörzet információk')
  }
}
</script>
