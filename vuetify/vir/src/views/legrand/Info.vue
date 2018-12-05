<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <BaseCard>
        <v-card-text>
          <SmartAutocomplete
            v-model="cikkId"
            label="Cikkszám"
            itemClass="body-2"
            :apiUrl="apiUrl"
            item-text="cikkszam"
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
import BaseCikkInfo from '@/components/legrand/BaseCikkInfo.vue'
import CikkKeszlet from '@/components/legrand/CikkKeszlet.vue'

export default {
  name: 'legrand-info',
  components: {
    BaseCard,
    SmartAutocomplete,
    BaseCikkInfo,
    CikkKeszlet
  },

  data () {
    return {
      cikkId: 0,
      cikk: {}
    }
  },

  methods: {
    apiUrl (content) {
      const params = { domain: [['cikkszam', 'ilike', content]], order: 'cikkszam', limit: 10 }
      return 'vir/searchRead/legrand.cikk?params=' + JSON.stringify(params)
    }
  },

  created () {
    this.$store.set('pageTitle', 'Termék információk')
  }
}
</script>
