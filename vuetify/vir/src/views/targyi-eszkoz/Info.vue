<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <BaseCard>
        <v-card-text>
          <LookupEszkoz
            v-model="leltariSzam"
            @change="eszkoz = $event"
          />
          <BaseEszkozInfo :eszkoz="eszkoz"/>
        </v-card-text>
      </BaseCard>
      <BaseCard title="Eszköz mozgásai">
        <v-card-text>
          <EszkozMozgas
            :eszkozId="eszkoz.id"
          />
        </v-card-text>
      </BaseCard>
    </v-layout>
  </v-container>
</template>

<script>
import BaseCard from '@/components/core/BaseCard.vue'
import BaseEszkozInfo from '@/components/targyi-eszkoz/BaseEszkozInfo.vue'
import LookupEszkoz from '@/components/targyi-eszkoz/LookupEszkoz.vue'
import EszkozMozgas from '@/components/targyi-eszkoz/EszkozMozgas.vue'

export default {
  name: 'targyi-eszkoz-info',
  components: {
    BaseCard,
    BaseEszkozInfo,
    LookupEszkoz,
    EszkozMozgas
  },

  data () {
    return {
      leltariSzam: '',
      eszkoz: {}
    }
  },

  created () {
    this.$store.set('pageTitle', 'Tárgyi eszköz információk')
  }
}
</script>
