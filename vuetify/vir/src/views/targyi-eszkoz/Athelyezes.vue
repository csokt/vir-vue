<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <Card>
        <v-card-text>
          <Autocomplete v-model="ujLeltarkorzetId" label="Új leltárkörzet" itemClass="body-2" :apiUrl="apiUrl" @change="ujLeltarkorzet = $event"/>
          <Eszkoz v-model="leltariSzam"  @change="eszkoz = $event"/>
          <EszkozInfo :eszkoz="eszkoz"/>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" :disabled="!athelyezheto" @click="athelyez">Áthelyezés az új körzetbe</v-btn>
        </v-card-actions>
      </Card>
      <Card title="Eszköz mozgásai">
        <v-card-text>
          <EszkozMozgas filter="eszkoz" :eszkoz="eszkoz" :reloadTrigger="reloadTrigger"/>
        </v-card-text>
      </Card>
    </v-layout>
  </v-container>
</template>

<script>
import { API, EventBus } from '@/util'
import Card from '@/components/base/Card.vue'
import Autocomplete from '@/components/base/Autocomplete.vue'
import Eszkoz from '@/components/targyi-eszkoz/Eszkoz.vue'
import EszkozInfo from '@/components/targyi-eszkoz/EszkozInfo.vue'
import EszkozMozgas from '@/components/targyi-eszkoz/EszkozMozgas.vue'

export default {
  name: 'athelyezes',
  components: {
    Card,
    Autocomplete,
    Eszkoz,
    EszkozInfo,
    EszkozMozgas
  },

  data () {
    return {
      ujLeltarkorzetId: 0,
      ujLeltarkorzet: {},
      leltariSzam: '',
      reloadTrigger: false,
      eszkoz: {}
    }
  },

  computed: {
    athelyezheto () {
      return this.ujLeltarkorzet.id && this.eszkoz.id && this.ujLeltarkorzet.id !== this.eszkoz.akt_leltarkorzet_id[0]
    }
  },

  methods: {
    apiUrl (content) {
      const params = { domain: [['name', 'ilike', content]], limit: 8, frontend: true }
      return 'vir/searchRead/leltar.korzet?params=' + JSON.stringify(params)
    },

    async athelyez () {
      const leltariSzam = this.leltariSzam
      const row = {
        eszkoz_id: this.eszkoz.id,
        hova_leltarkorzet_id: this.ujLeltarkorzet.id
      }
      this.leltariSzam = ''
      const response = await API.post('vir/create/leltar.eszkozmozgas', row)
      if (response.ok) {
        EventBus.$emit('inform', { type: 'alert', variation: 'success', message: 'Áthelyezve!' })
      } else {
        EventBus.$emit('inform', { type: 'alert', variation: 'error', message: response.data.error.data.message })
        console.log(response)
      }
      setTimeout(() => { this.leltariSzam = leltariSzam }, 50)
    }
  },

  created () {
  }
}
</script>
