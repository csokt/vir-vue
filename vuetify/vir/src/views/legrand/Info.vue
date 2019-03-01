<template>
  <v-container grid-list-lg pa-2>
    <v-layout justify-space-around wrap>
      <BaseCard>
        <v-card-text>
          <SmartAutocomplete
            v-model="cikkId"
            label="Cikkszám"
            itemClass="body-2"
            :apiUrl="apiUrl"
            item-text="cikkszam"
            @searchInput="searchInput = $event"
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
import BaseCard from '@/components/core/BaseCard.vue'
import BaseCikkInfo from '@/components/legrand/BaseCikkInfo.vue'
import SmartAutocomplete from '@/components/core/SmartAutocomplete.vue'
import ListCikkKeszlet from '@/components/legrand/ListCikkKeszlet.vue'

export default {
  name: 'legrand-info',
  components: {
    BaseCard,
    BaseCikkInfo,
    SmartAutocomplete,
    ListCikkKeszlet
  },

  data () {
    return {
      searchInput: '',
      cikkId: 0,
      cikk: {}
    }
  },

  computed: {
    apiUrl () {
      const params = { domain: [['cikkszam', 'ilike', this.searchInput]], order: 'cikkszam', limit: 10 }
      return 'vir/searchRead/legrand.cikk?params=' + JSON.stringify(params)
    }
  },

  created () {
    this.$store.set('pageTitle', 'Termék információk')
  }
}
</script>
