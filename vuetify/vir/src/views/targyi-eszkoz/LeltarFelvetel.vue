<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <Card>
        <v-card-text>
          <Eszkoz v-model="leltariSzam"  @change="onChange($event)"/>
        </v-card-text>
      </Card>
      <Card>
        <v-card-text>
          <EszkozInfo :eszkoz="eszkoz"/>
        </v-card-text>
      </Card>
    </v-layout>
  </v-container>
</template>

<script>
import { get } from 'vuex-pathify'
import { API, EventBus } from '@/util'
import Card from '@/components/base/Card.vue'
import Eszkoz from '@/components/targyi-eszkoz/Eszkoz.vue'
import EszkozInfo from '@/components/targyi-eszkoz/EszkozInfo.vue'
import EszkozMozgas from '@/components/targyi-eszkoz/EszkozMozgas.vue'

export default {
  name: 'targyi-eszkoz-leltar-felvetel',
  components: {
    Card,
    Eszkoz,
    EszkozInfo,
    EszkozMozgas
  },

  data () {
    return {
      leltariSzam: '',
      eszkoz: {}
    }
  },

  computed: {
    ...get(['leltariv'])
  },

  methods: {
    async onChange (content) {
      this.leltariSzam = ''
      if (!content.id) return
      this.eszkoz = content
      let params
      let response
      let row
      params = { domain: [['leltariv_id', '=', this.leltariv.id], ['eszkoz_id', '=', this.eszkoz.id]], limit: 1 }
      response = await API.get('vir/searchRead/leltar.leltariv_eszkoz?params=' + JSON.stringify(params))
      if (!response.ok) {
        EventBus.$emit('inform', { type: 'alert', variation: 'error', message: response.data.error.data.message })
        return
      }
      if (response.data.length) { // leltárkörzetbe tartozó eszköz
        const leltarivEszkoz = response.data[0]
        row = { fellelheto: true }
        response = await API.post('vir/update/leltar.leltariv_eszkoz/' + leltarivEszkoz.id.toString(), row)
        if (!response.ok) {
          EventBus.$emit('inform', { type: 'alert', variation: 'error', message: response.data.error.data.message })
          return
        }
      } else { // új tárgyi eszköz
        row = {
          leltariv_id: this.leltariv.id,
          eszkoz_id: this.eszkoz.id
        }
        response = await API.post('vir/create/leltar.leltariv_ujeszkoz', row)
        if (!response.ok) {
          EventBus.$emit('inform', { type: 'alert', variation: 'error', message: response.data.error.data.message })
          return
        }
      }
      EventBus.$emit('inform', { type: 'alert', variation: 'success', message: 'Felvéve!' })
    }
  },

  created () {
    this.$store.set('pageTitle', 'Tárgyi eszközök felvétele')
  }
}
</script>
