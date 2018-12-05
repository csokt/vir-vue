<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <BaseCard>
        <v-card-text>
          <SmartAutocomplete
            v-model="cikk.id"
            label="Cikkazonosító"
            itemClass="body-2"
            :apiUrl="apiUrl"
            :parentSearch="cikk.name"
            @change="cikk = $event"
          />
          <CikkByVonalkod
            v-model="cikk.vonalkod"
            @change="cikk = $event"
          />
          <BaseCikkInfo :cikk="cikk"/>
        </v-card-text>
      </BaseCard>
      <BaseCard title="Cikk készlet">
        <v-card-text>
          <CikkKeszlet :cikkId="cikk.id"/>
        </v-card-text>
      </BaseCard>
    </v-layout>
  </v-container>
</template>

<script>
import BaseCard from '@/components/base/BaseCard.vue'
import SmartAutocomplete from '@/components/base/SmartAutocomplete.vue'
import CikkByVonalkod from '@/components/chance/CikkByVonalkod.vue'
import BaseCikkInfo from '@/components/chance/BaseCikkInfo.vue'
import CikkKeszlet from '@/components/chance/CikkKeszlet.vue'

export default {
  name: 'chance-info',
  components: {
    BaseCard,
    SmartAutocomplete,
    CikkByVonalkod,
    BaseCikkInfo,
    CikkKeszlet
  },

  data () {
    return {
      cikk: {}
    }
  },

  methods: {
    apiUrl (content) {
      const params = { domain: [['name', 'ilike', content]], order: 'name', limit: 20 }
      return 'vir/searchRead/chance.cikk?params=' + JSON.stringify(params)
    }
  },

  created () {
    this.$store.set('pageTitle', 'Termék információk')
  }
}
</script>
