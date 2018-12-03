<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <Card>
        <v-card-text>
          <v-textarea v-model="leltariv.name" label="Leltárkörzet" rows="1" auto-grow readonly/>
          <v-text-field ref="kod"        v-model="ismeretlen.kod"        label="Kód"        clearable @keyup.enter="$refs.megnevezes.focus()" :rules="[rules.required, rules.kod]" validate-on-blur/>
          <v-text-field ref="megnevezes" v-model="ismeretlen.megnevezes" label="Megnevezés" clearable @keyup.enter="$refs.megjegyzes.focus()" :rules="[rules.required]"/>
          <v-text-field ref="megjegyzes" v-model="ismeretlen.megjegyzes" label="Megjegyzés" clearable @keyup.enter="$refs.megjegyzes.blur()"/>
        </v-card-text>
        <v-btn color="primary" :disabled="!checkFields" @click="felvesz">Felvesz</v-btn>
        <v-btn color="primary" :disabled="!checkFields || !ismeretlen.id" @click="modosit">Módosít</v-btn>
        <v-btn color="primary" :disabled="!checkFields || !ismeretlen.id" @click="torol">Töröl</v-btn>
      </Card>
      <Card title="Felvett ismeretlen eszközök">
        <v-card-text>
          <LeltarivIsmeretlen :leltarivId="leltariv.id" :reloadTrigger="reloadTrigger" @select="onSelect($event)"/>
        </v-card-text>
      </Card>
    </v-layout>
  </v-container>
</template>

<script>
import { get } from 'vuex-pathify'
import { API, EventBus, checkResponse } from '@/util'
import Card from '@/components/base/Card.vue'
import LeltarivIsmeretlen from '@/components/targyi-eszkoz/LeltarivIsmeretlen.vue'

export default {
  name: 'targyi-eszkoz-leltar-ismeretlen',
  components: {
    Card,
    LeltarivIsmeretlen
  },

  data () {
    return {
      ismeretlen: {},
      rules: {
        required: value => !!value || 'Kötelező mező',
        kod: value => {
          const pattern = /^\d\d\/\d\d\d$/
          return pattern.test(value) || 'Érvénytelen kód formátum'
        }
      },
      reloadTrigger: false
    }
  },

  computed: {
    ...get(['leltariv']),

    checkFields () {
      return this.ismeretlen.kod && this.ismeretlen.megnevezes && this.rules.kod(this.ismeretlen.kod) === true
    },

    row () {
      return {
        leltariv_id: this.leltariv.id,
        kod: this.ismeretlen.kod,
        megnevezes: this.ismeretlen.megnevezes,
        megjegyzes: this.ismeretlen.megjegyzes
      }
    }
  },

  methods: {
    async felvesz () {
      const response = await API.post('vir/create/leltar.leltariv_ismeretlen', this.row)
      if (!checkResponse(response)) return
      EventBus.$emit('inform', { type: 'alert', variation: 'success', message: 'Felvéve!' })
      this.reloadTrigger = !this.reloadTrigger
    },

    async modosit () {
      const response = await API.post('vir/update/leltar.leltariv_ismeretlen/' + this.ismeretlen.id.toString(), this.row)
      if (!checkResponse(response)) return
      EventBus.$emit('inform', { type: 'alert', variation: 'success', message: 'Módosítva!' })
      this.reloadTrigger = !this.reloadTrigger
    },

    async torol () {
      const response = await API.post('vir/delete/leltar.leltariv_ismeretlen/' + this.ismeretlen.id.toString())
      if (!checkResponse(response)) return
      EventBus.$emit('inform', { type: 'alert', variation: 'success', message: 'Törölve!' })
      this.reloadTrigger = !this.reloadTrigger
    },

    async onSelect (content) {
      this.ismeretlen = { ...content }
      if (!this.ismeretlen.megjegyzes) this.ismeretlen.megjegyzes = ''
      await this.$nextTick()
      window.scrollTo(0, 0)
      this.$refs.kod.focus()
    }
  },

  created () {
    this.$store.set('pageTitle', 'Ismeretlen eszközök')
  },

  mounted () {
    this.$refs.kod.focus()
  }
}
</script>
