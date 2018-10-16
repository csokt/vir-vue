<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <Card>
        <v-card-text>
          <Autocomplete v-model="ujHasznaloId" label="Új használó" itemClass="body-2" :apiUrl="apiUrl" @change="ujHasznalo = $event"/>
          <Eszkoz v-model="leltariSzam"  @change="eszkoz = $event"/>
          <EszkozInfo :eszkoz="eszkoz"/>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" :disabled="!atadhato" @click="atad">Használatba adás</v-btn>
        </v-card-actions>
      </Card>
      <Card title="Eszköz mozgásai">
        <v-card-text>
          <EszkozMozgas filter="eszkoz" :eszkoz="eszkoz"/>
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
import EszkozMozgas from '@/components/targyi-eszkoz/EszkozMozgas.vue'

export default {
  name: 'szemelynek',
  components: {
    Card,
    Autocomplete,
    Eszkoz,
    EszkozInfo,
    EszkozMozgas
  },

  data () {
    return {
      ujHasznaloId: 0,
      ujHasznalo: {},
      leltariSzam: '',
      eszkoz: {}
    }
  },

  computed: {
    atadhato () {
      return this.ujHasznalo.id && this.eszkoz.id && this.ujHasznalo.id !== this.eszkoz.akt_hasznalo_id[0]
    }
  },

  methods: {
    apiUrl (content) {
      const params = { domain: [['name', 'ilike', content]], limit: 8, frontend: true }
      return 'vir/searchRead/hr.employee?params=' + JSON.stringify(params)
    },

    async atad () {
      // const leltariSzam = this.leltariSzam
      // this.leltariSzam = ''
      const row = {
        eszkoz_id: this.eszkoz.id,
        uj_hasznalo_id: this.ujHasznalo.id,
        megjegyzes: ''
      }
      const response = await API.post('vir/create/leltar.eszkozatvetel', row)
      if (response.ok) {
        EventBus.$emit('inform', { type: 'alert', variation: 'success', message: 'Átadva!' })
      } else {
        EventBus.$emit('inform', { type: 'alert', variation: 'error', message: response.data.error.data.message })
        console.log(response)
      }
      // setTimeout(() => { this.leltariSzam = leltariSzam }, 50)
    }
  },

  created () {
  }
}
</script>
