<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <BaseCard>
        <v-card-text>
          <SmartAutocomplete
            v-model="ujHasznaloId"
            label="Új használó"
            itemClass="body-2"
            :apiUrl="apiUrl"
            @searchInput="searchInput = $event"
          />
          <LookupEszkoz
            v-model="leltariSzam"
            :reloadTrigger="reloadTrigger"
            @change="eszkoz = $event"
          />
          <BaseEszkozInfo :eszkoz="eszkoz"/>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            :disabled="!atadhato"
            @click="atad"
          >
            Használatba adás
          </v-btn>
        </v-card-actions>
      </BaseCard>
      <BaseCard title="Jelenleg használatban">
        <v-card-text>
          <Eszkozhasznalo
            :hasznaloId="ujHasznaloId"
            :reloadTrigger="reloadTrigger"
          />
        </v-card-text>
      </BaseCard>
    </v-layout>
  </v-container>
<!--
-->
</template>

<script>
import { API, EventBus, checkResponse } from '@/util'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseEszkozInfo from '@/components/targyi-eszkoz/BaseEszkozInfo.vue'
import SmartAutocomplete from '@/components/base/SmartAutocomplete.vue'
import LookupEszkoz from '@/components/targyi-eszkoz/LookupEszkoz.vue'
import Eszkozhasznalo from '@/components/targyi-eszkoz/Eszkozhasznalo.vue'

export default {
  name: 'targyi-eszkoz-szemelynek',
  components: {
    BaseCard,
    BaseEszkozInfo,
    SmartAutocomplete,
    LookupEszkoz,
    Eszkozhasznalo
  },

  data () {
    return {
      searchInput: '',
      ujHasznaloId: 0,
      leltariSzam: '',
      reloadTrigger: false,
      eszkoz: {}
    }
  },

  computed: {
    apiUrl () {
      const params = { domain: [['name', 'ilike', this.searchInput]], limit: 10 }
      return 'vir/searchRead/hr.employee?params=' + JSON.stringify(params)
    },

    atadhato () {
      return this.ujHasznaloId && this.eszkoz.id && this.ujHasznaloId !== this.eszkoz.akt_hasznalo_id[0]
    }
  },

  methods: {
    async atad () {
      const row = {
        eszkoz_id: this.eszkoz.id,
        uj_hasznalo_id: this.ujHasznaloId,
        megjegyzes: ''
      }
      const response = await API.post('vir/create/leltar.eszkozatvetel', row)
      if (!checkResponse(response)) return
      EventBus.$emit('inform', { type: 'alert', variation: 'success', message: 'Átadva!' })
      this.reloadTrigger = !this.reloadTrigger
    }
  },

  created () {
    this.$store.set('pageTitle', 'Személyes használatra')
  }
}
</script>
