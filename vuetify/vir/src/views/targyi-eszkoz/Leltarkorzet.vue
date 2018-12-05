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
import SmartAutocomplete from '@/components/base/SmartAutocomplete.vue'
import BaseKorzetInfo from '@/components/targyi-eszkoz/BaseKorzetInfo.vue'
import KorzetEszkozok from '@/components/targyi-eszkoz/KorzetEszkozok.vue'

export default {
  name: 'targyi-eszkoz-leltarkorzet',
  components: {
    BaseCard,
    SmartAutocomplete,
    BaseKorzetInfo,
    KorzetEszkozok
  },

  data () {
    return {
      leltarkorzetId: 0,
      leltarkorzet: {}
    }
  },

  methods: {
    apiUrl (content) {
      const params = { domain: [['name', 'ilike', content]], limit: 8 }
      return 'vir/searchRead/leltar.korzet?params=' + JSON.stringify(params)
    }
  },

  created () {
    this.$store.set('pageTitle', 'Leltárkörzet információk')
  }
}
</script>
