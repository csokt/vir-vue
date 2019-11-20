<template>
  <v-container grid-list-lg pa-2>
    <v-layout justify-space-around wrap>
      <BaseCard>
        <v-card-text>
          <v-textarea
            v-model="chanceiv.name"
            label="Raktár"
            rows="1"
            auto-grow
            readonly
          />
          <LookupCikk
            ref="lookupcikk"
            v-model="vonalkod"
            @change="onChange($event)"
          />
          <BaseCikkInfo2 :cikk="cikk"/>
          <v-textarea
            v-model="leltarivFelmeres.fellelt"
            label="Eddig fellelt db"
            rows="1"
            auto-grow
            readonly
          />
        </v-card-text>
        <v-btn
          v-if="kezi"
          color="primary"
          :disabled="!felveheto"
          @click="felvesz"
        >
          Cikk felvétele
        </v-btn>
        <v-btn
          v-if="kezi"
          color="warning"
          :disabled="!levonhato"
          @click="levon"
        >
          Cikk levonása
        </v-btn>
      </BaseCard>
    </v-layout>
  </v-container>
</template>

<script>
import { get } from 'vuex-pathify'
import { API, EventBus, checkResponse } from '@/util'
import BaseCard from '@/components/core/BaseCard.vue'
import BaseCikkInfo2 from '@/components/chance/BaseCikkInfo2.vue'
import LookupCikk from '@/components/chance/LookupCikk.vue'

export default {
  name: 'chance-leltar-felvetel',
  components: {
    BaseCard,
    BaseCikkInfo2,
    LookupCikk
  },

  props: {
    kezi: Boolean
  },

  data () {
    return {
      vonalkod: '',
      cikk: {},
      leltarivFelmeres: {}
    }
  },

  computed: {
    ...get(['chanceiv']),

    felveheto () {
      return this.cikk.id
    },

    levonhato () {
      return this.leltarivFelmeres.fellelt
    }
  },

  methods: {
    async getFelmeres () {
      const params = { domain: [['leltariv_id', '=', this.chanceiv.id], ['cikk_id', '=', this.cikk.id]], limit: 1 }
      const response = await API.get('vir/searchRead/chance.leltariv_felmeres?params=' + JSON.stringify(params))
      const check = checkResponse(response)
      this.leltarivFelmeres = check ? response.data.length ? response.data[0] : {} : {}
      return check
    },

    async felvesz () {
      let response
      if (this.leltarivFelmeres.id) { // már felvettük a cikket
        response = await API.post('vir/update/chance.leltariv_felmeres/' + this.leltarivFelmeres.id.toString(), { fellelt: this.leltarivFelmeres.fellelt + 1 })
        if (!checkResponse(response)) return
      } else { // új cikk
        const row = {
          leltariv_id: this.chanceiv.id,
          cikk_id: this.cikk.id,
          fellelt: 1
        }
        response = await API.post('vir/create/chance.leltariv_felmeres', row)
        if (!checkResponse(response)) return
      }
      await this.getFelmeres() && EventBus.$emit('inform', { type: 'alert', variation: 'success', message: 'Felvéve!' })
    },

    async levon () {
      if (!this.leltarivFelmeres.id) return // ide nem is juthatnánk
      const response = await API.post('vir/update/chance.leltariv_felmeres/' + this.leltarivFelmeres.id.toString(), { fellelt: this.leltarivFelmeres.fellelt - 1 })
      if (!checkResponse(response)) return
      await this.getFelmeres() && EventBus.$emit('inform', { type: 'alert', variation: 'success', message: 'Levonva!' })
    },

    async onChange (content) {
      this.vonalkod = ''
      if (!content.id) return
      this.cikk = content
      await this.getFelmeres() && !this.kezi && this.felvesz()
    }
  },

  created () {
    this.$store.set('pageTitle', 'Chance leltár felvétele')
  },

  mounted () {
    this.$refs.lookupcikk.focus()
  }
}
</script>
