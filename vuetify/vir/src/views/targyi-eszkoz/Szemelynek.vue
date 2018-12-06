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
import SmartAutocomplete from '@/components/base/SmartAutocomplete.vue'
import LookupEszkoz from '@/components/targyi-eszkoz/LookupEszkoz.vue'
import BaseEszkozInfo from '@/components/targyi-eszkoz/BaseEszkozInfo.vue'
import Eszkozhasznalo from '@/components/targyi-eszkoz/Eszkozhasznalo.vue'

export default {
  name: 'targyi-eszkoz-szemelynek',
  components: {
    BaseCard,
    SmartAutocomplete,
    LookupEszkoz,
    BaseEszkozInfo,
    Eszkozhasznalo
  },

  data () {
    return {
      ujHasznaloId: 0,
      leltariSzam: '',
      reloadTrigger: false,
      eszkoz: {}
    }
  },

  computed: {
    atadhato () {
      return this.ujHasznaloId && this.eszkoz.id && this.ujHasznaloId !== this.eszkoz.akt_hasznalo_id[0]
    }
  },

  methods: {
    apiUrl (content) {
      const params = { domain: [['name', 'ilike', content]], limit: 8 }
      return 'vir/searchRead/hr.employee?params=' + JSON.stringify(params)
    },

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
