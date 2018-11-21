<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <Card>
        <v-card-text>
          <v-textarea ref="leltariv" v-model="leltariv.name" label="Leltárkörzet" rows="1" auto-grow readonly/>
          <Eszkoz v-model="leltariSzam" :focus="true" @change="onChange($event)"/>
          <EszkozInfo :eszkoz="eszkoz"/>
        </v-card-text>
        <v-btn v-if="kezi" color="primary" :disabled="!felveheto" @click="felvesz">Tárgyi eszköz felvétele</v-btn>
        <v-card-text>
          <v-text-field readonly/>
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
      <Card title="Hiányzó eszközök">
        <v-card-text>
          <LeltarivEszkozok filter="hiany" :leltarivId="leltariv.id" :reloadTrigger="reloadTrigger" @select="onSelect($event)"/>
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
import LeltarivEszkozok from '@/components/targyi-eszkoz/LeltarivEszkozok.vue'

export default {
  name: 'targyi-eszkoz-leltar-felvetel',
  components: {
    Card,
    Eszkoz,
    EszkozInfo,
    LeltarivEszkozok
  },

  props: {
    kezi: Boolean
  },

  data () {
    return {
      leltariSzam: '',
      eszkoz: {},
      leltarivEszkoz: {},
      felveheto: false,
      reloadTrigger: false,
      felvettEszkozokId: 0,
      felvettEszkozok: []
    }
  },

  computed: {
    ...get(['leltariv'])
  },

  methods: {
    async onChange (content) {
      this.felveheto = false
      this.leltariSzam = ''
      if (!content.id) return
      this.eszkoz = content
      // let params, response
      this.felvettEszkozokId += 1

      const params = { domain: [['leltariv_id', '=', this.leltariv.id], ['eszkoz_id', '=', this.eszkoz.id]], limit: 1 }
      const response = await API.get('vir/searchRead/leltar.leltariv_osszes?params=' + JSON.stringify(params))
      if (!checkResponse(response)) return
      this.leltarivEszkoz = response.data.length ? response.data[0] : {}
      if (this.leltarivEszkoz.fellelheto) {
        this.felvettEszkozok.unshift({ id: this.felvettEszkozokId, name: this.eszkoz.name, label: 'Az eszköz már felvéve' })
        EventBus.$emit('inform', { type: 'alert', variation: 'warning', message: 'Az eszköz már felvéve!' })
        return
      }

      if (this.kezi) this.$refs.leltariv.focus()
      this.felveheto = true
      if (!this.kezi) this.felvesz()
    },

    async felvesz () {
      this.felveheto = false
      let response, row
      if (this.leltarivEszkoz.leltariv_eszkoz_id) { // leltárkörzetbe tartozó eszköz
        row = { fellelheto: true }
        response = await API.post('vir/update/leltar.leltariv_eszkoz/' + this.leltarivEszkoz.leltariv_eszkoz_id.toString(), row)
        if (!checkResponse(response)) return
        this.felvettEszkozok.unshift({ id: this.felvettEszkozokId, name: this.eszkoz.name, label: 'Fellelt eszköz' })
        EventBus.$emit('inform', { type: 'alert', variation: 'success', message: 'Felvéve!' })
        this.reloadTrigger = !this.reloadTrigger
      } else { // új tárgyi eszköz
        row = {
          leltariv_id: this.leltariv.id,
          eszkoz_id: this.eszkoz.id
        }
        response = await API.post('vir/create/leltar.leltariv_ujeszkoz', row)
        if (!checkResponse(response)) return
        this.felvettEszkozok.unshift({ id: this.felvettEszkozokId, name: this.eszkoz.name, label: 'Új eszköz' })
        EventBus.$emit('inform', { type: 'alert', variation: 'success', message: 'Felvéve!' })
      }
    },

    async onSelect (content) {
      if (!this.kezi) return
      this.felveheto = false
      this.leltarivEszkoz = content
      const params = { domain: [['id', '=', this.leltarivEszkoz.eszkoz_id[0]]] }
      const response = await API.get('vir/searchRead/leltar.eszkoz?params=' + JSON.stringify(params))
      if (!checkResponse(response)) return
      this.eszkoz = response.data.length ? response.data[0] : {}
      this.felveheto = true
      // await this.$nextTick()
      window.scrollTo(0, 0)
    }
  },

  created () {
    this.$store.set('pageTitle', 'Tárgyi eszközök felvétele')
  }
}
</script>
