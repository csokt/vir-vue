<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <BaseCard>
        <v-card-text>
          <SmartAutocomplete
            v-model="cikk.id"
            label="Cikkazonosító"
            itemClass="body-2"
            :apiUrl="cikkApiUrl"
            @searchInput="searchInput = $event"
            @change="cikk = $event"
          />
          <SmartQlookup
            v-model="cikk.vonalkod"
            label="Vonalkód"
            :apiUrl="vonalkodApiUrl"
            @change="cikk = $event; searchInput = cikk.name"
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
import SmartQlookup from '@/components/base/SmartQlookup.vue'
import BaseCikkInfo from '@/components/chance/BaseCikkInfo.vue'
import ListCikkKeszlet from '@/components/chance/ListCikkKeszlet.vue'

export default {
  name: 'chance-info',
  components: {
    BaseCard,
    SmartAutocomplete,
    SmartQlookup,
    BaseCikkInfo,
    ListCikkKeszlet
  },

  data () {
    return {
      searchInput: '',
      cikk: {}
    }
  },

  computed: {
    cikkApiUrl () {
      const params = { domain: [['name', 'ilike', this.searchInput]], order: 'name', limit: 10 }
      return 'vir/searchRead/chance.cikk?params=' + JSON.stringify(params)
    },

    vonalkodApiUrl () {
      const params = { domain: [['vonalkod', '=', this.cikk.vonalkod]] }
      return 'vir/searchRead/chance.cikk?params=' + JSON.stringify(params)
    }
  },

  created () {
    this.$store.set('pageTitle', 'Termék információk')
  }
}
</script>
