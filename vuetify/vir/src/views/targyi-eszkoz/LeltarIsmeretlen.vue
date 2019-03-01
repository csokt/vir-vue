<template>
  <v-container grid-list-lg pa-2>
    <v-layout justify-space-around wrap>
      <BaseCard>
        <v-card-text>
          <v-textarea
            v-model="leltariv.name"
            label="Leltárkörzet"
            rows="1"
            auto-grow readonly
          />
          <v-text-field
            ref="kod"
            v-model="ismeretlen.kod"
            label="Kód"
            clearable
            :rules="[rules.required, rules.kod]"
            validate-on-blur
            @keyup.enter="$refs.megnevezes.focus()"
          />
          <v-text-field
            ref="megnevezes"
            v-model="ismeretlen.megnevezes"
            label="Megnevezés"
            clearable
            :rules="[rules.required]"
            @keyup.enter="$refs.megjegyzes.focus()"
          />
          <v-text-field
            ref="megjegyzes"
            v-model="ismeretlen.megjegyzes"
            label="Megjegyzés"
            clearable
            @keyup.enter="$refs.megjegyzes.blur()"
          />
        </v-card-text>
        <v-btn
          color="primary"
          :disabled="!checkFields"
          @click="felvesz"
        >
          Felvesz
        </v-btn>
        <v-btn
          color="primary"
          :disabled="!checkFields || !ismeretlen.id"
          @click="modosit"
        >
          Módosít
        </v-btn>
        <v-btn
          color="primary"
          :disabled="!checkFields || !ismeretlen.id"
          @click="torol"
        >
          Töröl
        </v-btn>
      </BaseCard>
      <BaseCard title="Felvett ismeretlen eszközök">
        <v-card-text>
          <SmartList
            ref="eszkozok"
            :apiUrl="apiUrl"
            value="name"
            :label="label"
            @select="onSelect($event)"
          />
        </v-card-text>
      </BaseCard>
    </v-layout>
  </v-container>
</template>

<script>
import { get } from 'vuex-pathify'
import { API, EventBus, utc2local, checkResponse } from '@/util'
import BaseCard from '@/components/core/BaseCard.vue'
import SmartList from '@/components/core/SmartList.vue'

export default {
  name: 'targyi-eszkoz-leltar-ismeretlen',
  components: {
    BaseCard,
    SmartList
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
      }
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
    },

    apiUrl () {
      if (!this.leltariv.id) {
        return ''
      }
      const params = { domain: [['leltariv_id', '=', this.leltariv.id]] }
      return 'vir/searchRead/leltar.leltariv_ismeretlen?params=' + JSON.stringify(params)
    }
  },

  methods: {
    label (item) {
      return utc2local(item.write_date)
    },

    async felvesz () {
      const response = await API.post('vir/create/leltar.leltariv_ismeretlen', this.row)
      if (!checkResponse(response)) return
      EventBus.$emit('inform', { type: 'alert', variation: 'success', message: 'Felvéve!' })
      this.$refs.eszkozok.reload()
    },

    async modosit () {
      const response = await API.post('vir/update/leltar.leltariv_ismeretlen/' + this.ismeretlen.id.toString(), this.row)
      if (!checkResponse(response)) return
      EventBus.$emit('inform', { type: 'alert', variation: 'success', message: 'Módosítva!' })
      this.$refs.eszkozok.reload()
    },

    async torol () {
      const response = await API.post('vir/delete/leltar.leltariv_ismeretlen/' + this.ismeretlen.id.toString())
      if (!checkResponse(response)) return
      EventBus.$emit('inform', { type: 'alert', variation: 'success', message: 'Törölve!' })
      this.$refs.eszkozok.reload()
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
