<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <Card>
        <v-card-text>
          <Eszkoz v-model="leltariSzam"  @change="onChange($event)"/>
          <v-textarea
            v-for="(row, index) in felvettEszkozok"
            :key="index"
            v-model="row.name"
            :label="row.label"
            rows="1"
            auto-grow
            readonly
          />
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
import { API, EventBus, checkResponse } from '@/util'
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
      eszkoz: {},
      felvettEszkozokId: 0,
      felvettEszkozok: []
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
      let params, response, row
      params = { domain: [['leltariv_id', '=', this.leltariv.id], ['eszkoz_id', '=', this.eszkoz.id]], limit: 1 }
      response = await API.get('vir/searchRead/leltar.leltariv_eszkoz?params=' + JSON.stringify(params))
      if (!checkResponse(response)) return
      this.felvettEszkozokId += 1
      if (response.data.length) { // leltárkörzetbe tartozó eszköz
        const leltarivEszkoz = response.data[0]
        row = { fellelheto: true }
        response = await API.post('vir/update/leltar.leltariv_eszkoz/' + leltarivEszkoz.id.toString(), row)
        if (!checkResponse(response)) return
        this.felvettEszkozok.unshift({ id: this.felvettEszkozokId, name: this.eszkoz.name, label: 'Fellelt eszköz' })
        EventBus.$emit('inform', { type: 'alert', variation: 'success', message: 'Felvéve!' })
      } else { // új tárgyi eszköz
        params = { domain: [['leltariv_id', '=', this.leltariv.id], ['eszkoz_id', '=', this.eszkoz.id]], limit: 1 }
        response = await API.get('vir/searchRead/leltar.leltariv_ujeszkoz?params=' + JSON.stringify(params))
        if (!checkResponse(response)) return
        if (response.data.length) { // új eszköz, de már felvéve
          EventBus.$emit('inform', { type: 'alert', variation: 'warning', message: 'Új eszköz, de már felvéve!' })
        } else { // új eszköz, még nincs felvéve
          row = {
            leltariv_id: this.leltariv.id,
            eszkoz_id: this.eszkoz.id
          }
          response = await API.post('vir/create/leltar.leltariv_ujeszkoz', row)
          if (!checkResponse(response)) return
          this.felvettEszkozok.unshift({ id: this.felvettEszkozokId, name: this.eszkoz.name, label: 'Új eszköz' })
          EventBus.$emit('inform', { type: 'alert', variation: 'success', message: 'Felvéve!' })
        }
      }
    }
  },

  created () {
    this.$store.set('pageTitle', 'Tárgyi eszközök felvétele')
  }
}
</script>
