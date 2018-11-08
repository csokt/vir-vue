<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <Card>
        <v-card-text>
          <Mtime :value="kezdIdo" @input="$store.commit('kezdIdo', $event)" label="Munkaidő kezdete" :allowed-minutes="allowedMinutes"/>
          <v-text-field v-model="aktIdo" label="Aktuális idő" readonly/>
          <v-text-field v-model="elteltPerc" label="Eltelt idő (perc)" readonly/>
          <v-text-field v-model="osszesNormaperc" label="Összes normaperc" readonly/>
          <v-text-field v-model="teljesitmeny" label="Teljesítmény %" readonly/>
        </v-card-text>
      </Card>
    </v-layout>
  </v-container>
</template>

<script>
import { get } from 'vuex-pathify'
import { API, EventBus } from '@/util'
import Card from '@/components/base/Card.vue'
import Mtime from '@/components/base/Mtime.vue'

export default {
  name: 'norma',
  components: {
    Card,
    Mtime
  },

  data () {
    return {
      aktIdo: new Date().toLocaleTimeString().slice(0, 5),
      osszesNormaperc: 0
    }
  },

  computed: {
    ...get(['user', 'kezdIdo']),

    elteltPerc: function () {
      return this.minutes(this.aktIdo) - this.minutes(this.kezdIdo)
    },
    teljesitmeny: function () {
      return Math.round(100 * this.osszesNormaperc / this.elteltPerc)
    }
  },

  methods: {
    minutes: (m) => {
      const a = m.split(':')
      return (+a[0]) * 60 + (+a[1])
    },

    allowedMinutes: (m) => m % 5 === 0,

    async sumNormaperc () {
      // Log('norma')
      const response = await API.get('tir/normaperc/' + this.user.tir_azonosito)
      if (response.ok) {
        this.osszesNormaperc = Math.round(response.data.sum)
      } else {
        EventBus.$emit('inform', { type: 'alert', variation: 'error', message: response.data.error.data.message })
        // Log('message', {message: this.message})
        console.log(response)
      }
    }
  },

  created () {
    // Log('navigate')
    this.sumNormaperc()
  }
}
</script>
