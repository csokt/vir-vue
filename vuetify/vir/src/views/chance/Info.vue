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
          <LookupCikkByVonalkod
            v-model="cikk.vonalkod"
            @change="cikk = $event"
          />
          <BaseCikkInfo :cikk="cikk"/>
        </v-card-text>
      </BaseCard>
      <BaseCard title="Cikk készlet">
        <v-card-text>
          <ListCikkKeszlet :cikkId="cikk.id"/>
        </v-card-text>
      </BaseCard>
    </v-layout>
  </v-container>
</template>

<script>
import BaseCard from '@/components/base/BaseCard.vue'
import SmartAutocomplete from '@/components/base/SmartAutocomplete.vue'
import LookupCikkByVonalkod from '@/components/chance/LookupCikkByVonalkod.vue'
import BaseCikkInfo from '@/components/chance/BaseCikkInfo.vue'
import ListCikkKeszlet from '@/components/chance/ListCikkKeszlet.vue'

export default {
  name: 'chance-info',
  components: {
    BaseCard,
    SmartAutocomplete,
    LookupCikkByVonalkod,
    BaseCikkInfo,
    ListCikkKeszlet
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
