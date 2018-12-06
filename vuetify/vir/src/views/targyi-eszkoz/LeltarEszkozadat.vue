<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <BaseCard>
        <v-card-text>
          <v-textarea
            v-model="leltariv.name"
            label="Leltárkörzet"
            rows="1"
            auto-grow
            readonly
          />
          <LookupEszkoz
            v-model="leltariSzam"
            :focus="true"
            @change="onChange($event)"
          />
          <v-textarea
            ref="eszkoz"
            v-model="eszkoz.name"
            label="Tárgyi eszköz"
            rows="1"
            auto-grow
            readonly
          />
          <v-checkbox
            v-model="leltarivEszkoz.serult_cimke"
            label="Sérült / hiányzó címke?"
          />
          <v-checkbox
            v-model="leltarivEszkoz.selejtezni"
            label="Selejtezni?"
          />
          <v-textarea
            v-model="leltarivEszkoz.megjegyzes"
            label="Megjegyzés"
            rows="1"
            auto-grow
          />
        </v-card-text>
        <v-btn
          color="primary"
          :disabled="!felveheto"
          @click="felvesz"
        >
          Adatok rögzítése
        </v-btn>
      </BaseCard>
      <BaseCard :title="titleEszkozok">
        <v-card-text>
          <LeltarivEszkozok
            filter="fellelt"
            :leltarivId="leltariv.id"
            :reloadTrigger="reloadTrigger"
            @length="lengthEszkozok=$event"
            @select="onSelect($event)"
          />
        </v-card-text>
      </BaseCard>
    </v-layout>
  </v-container>
<!--
-->
</template>

<script>
import { get } from 'vuex-pathify'
import { API, EventBus, checkResponse } from '@/util'
import BaseCard from '@/components/base/BaseCard.vue'
import LookupEszkoz from '@/components/targyi-eszkoz/LookupEszkoz.vue'
import LeltarivEszkozok from '@/components/targyi-eszkoz/LeltarivEszkozok.vue'

export default {
  name: 'targyi-eszkoz-leltar-eszkozadat',
  components: {
    BaseCard,
    LookupEszkoz,
    LeltarivEszkozok
  },

  data () {
    return {
      leltariSzam: '',
      eszkoz: {},
      leltarivEszkoz: {},
      felveheto: false,
      reloadTrigger: false,
      lengthEszkozok: 0
    }
  },

  computed: {
    ...get(['leltariv']),

    titleEszkozok () {
      return 'Fellelt eszközök (' + this.lengthEszkozok + ')'
    }
  },

  methods: {
    async onChange (content) {
      this.felveheto = false
      this.leltariSzam = ''
      if (!content.id) return
      this.eszkoz = content

      const params = { domain: [['leltariv_id', '=', this.leltariv.id], ['eszkoz_id', '=', this.eszkoz.id], ['fellelheto', '=', true]], limit: 1 }
      const response = await API.get('vir/searchRead/leltar.leltariv_osszes?params=' + JSON.stringify(params))
      if (!checkResponse(response)) return
      if (response.data.length) {
        this.leltarivEszkoz = response.data[0]
        if (!this.leltarivEszkoz.megjegyzes) this.leltarivEszkoz.megjegyzes = ''
        this.felveheto = true
        this.$refs.eszkoz.focus()
      } else {
        this.leltarivEszkoz = {}
        EventBus.$emit('inform', { type: 'alert', variation: 'warning', message: 'Az eszköz nincs felvéve a körzetbe!' })
      }
    },

    async felvesz () {
      this.felveheto = false
      let response
      const row = {
        serult_cimke: this.leltarivEszkoz.serult_cimke,
        selejtezni: this.leltarivEszkoz.selejtezni,
        megjegyzes: this.leltarivEszkoz.megjegyzes
      }
      if (this.leltarivEszkoz.leltariv_eszkoz_id) { // generált eszköz
        response = await API.post('vir/update/leltar.leltariv_eszkoz/' + this.leltarivEszkoz.leltariv_eszkoz_id.toString(), row)
      } else if (this.leltarivEszkoz.leltariv_ujeszkoz_id) { // új eszköz
        response = await API.post('vir/update/leltar.leltariv_ujeszkoz/' + this.leltarivEszkoz.leltariv_ujeszkoz_id.toString(), row)
      } else {
        EventBus.$emit('inform', { type: 'alert', variation: 'warning', message: 'Nem sikerült felvenni!' })
        return
      }
      if (!checkResponse(response)) return
      EventBus.$emit('inform', { type: 'alert', variation: 'success', message: 'Felvéve!' })
      this.reloadTrigger = !this.reloadTrigger
    },

    async onSelect (content) {
      this.felveheto = false
      this.leltarivEszkoz = content
      if (!this.leltarivEszkoz.megjegyzes) this.leltarivEszkoz.megjegyzes = ''
      // const params = { domain: [['id', '=', this.leltarivEszkoz.eszkoz_id[0]]] }
      // const response = await API.get('vir/searchRead/leltar.eszkoz?params=' + JSON.stringify(params))
      // if (!checkResponse(response)) return
      // this.eszkoz = response.data.length ? response.data[0] : {}
      this.eszkoz = { name: this.leltarivEszkoz.eszkoz_id[1] }
      this.felveheto = true
      await this.$nextTick()
      window.scrollTo(0, 0)
    }
  },

  created () {
    this.$store.set('pageTitle', 'Selejtezés, sérült címke')
  }
}
</script>
