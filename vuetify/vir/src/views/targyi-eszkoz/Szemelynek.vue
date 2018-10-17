<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <Card>
        <v-card-text>
          <Autocomplete v-model="ujHasznaloId" label="Új használó" itemClass="body-2" :apiUrl="apiUrl"/>
          <Eszkoz v-model="leltariSzam"  @change="eszkoz = $event"/>
          <EszkozInfo :eszkoz="eszkoz"/>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" :disabled="!atadhato" @click="atad">Használatba adás</v-btn>
        </v-card-actions>
      </Card>
      <Card title="Jelenleg használatban">
        <v-card-text>
          <Eszkozhasznalo :hasznaloId="ujHasznaloId" :reloadTrigger="reloadTrigger"/>
        </v-card-text>
      </Card>
    </v-layout>
  </v-container>
<!--
-->
</template>

<script>
import { API, EventBus } from '@/util'
import Card from '@/components/base/Card.vue'
import Autocomplete from '@/components/base/Autocomplete.vue'
import Eszkoz from '@/components/targyi-eszkoz/Eszkoz.vue'
import EszkozInfo from '@/components/targyi-eszkoz/EszkozInfo.vue'
import Eszkozhasznalo from '@/components/targyi-eszkoz/Eszkozhasznalo.vue'

export default {
  name: 'szemelynek',
  components: {
    Card,
    Autocomplete,
    Eszkoz,
    EszkozInfo,
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
      const params = { domain: [['name', 'ilike', content]], limit: 8, frontend: true }
      return 'vir/searchRead/hr.employee?params=' + JSON.stringify(params)
    },

    async atad () {
      const leltariSzam = this.leltariSzam
      const row = {
        eszkoz_id: this.eszkoz.id,
        uj_hasznalo_id: this.ujHasznaloId,
        megjegyzes: ''
      }
      this.leltariSzam = ''
      const response = await API.post('vir/create/leltar.eszkozatvetel', row)
      if (response.ok) {
        EventBus.$emit('inform', { type: 'alert', variation: 'success', message: 'Átadva!' })
      } else {
        EventBus.$emit('inform', { type: 'alert', variation: 'error', message: response.data.error.data.message })
        console.log(response)
      }
      this.reloadTrigger = !this.reloadTrigger
      setTimeout(() => { this.leltariSzam = leltariSzam }, 50)
    }
  },

  created () {
  }
}
</script>
