<template>
  <v-container fluid fill-height grid-list-lg>
    <v-layout  justify-center wrap>
      <Card>
        <v-card-text>
          <Qfield v-model="leltariSzam" label="Leltári szám" required @change="onChange" />
          <v-text-field v-model="eszkoz.megnevezes" label="Eszköz" readonly />
          <v-text-field v-model="leltarcsoport" label="Leltárcsoport" readonly />
          <v-text-field v-model="leltarkorzet" label="Aktuális leltárkörzet" readonly />
          <v-text-field v-if="hasznalo" v-model="hasznalo" label="Aktuális használó" readonly />
          <v-text-field v-if="eszkoz.selejt_ok" v-model="eszkoz.selejt_ok" label="Selejtezni" readonly />
        </v-card-text>
      </Card>
      <Card title="Eszköz mozgásai">
        <v-card-text>
          <v-text-field v-for="row in mozgas" :key="row.id" v-model="row.hova_leltarkorzet_id[1]" :label="utc2local(row.create_date)" readonly />
        </v-card-text>
      </Card>
    </v-layout>
  </v-container>
<!--
-->
</template>

<script>
import { API, EventBus } from '@/util'
import Qfield from '@/components/base/Qfield.vue'
import Card from '@/components/base/Card.vue'

function queryParams (params) {
  return '?params=' + JSON.stringify(params)
}

export default {
  name: 'info',
  components: {
    Qfield,
    Card
  },

  data () {
    return {
      leltariSzam: '',
      eszkoz: {},
      mozgas: []
    }
  },

  computed: {
    leltarcsoport () {
      return this.eszkoz.id && this.eszkoz.leltarcsoport_id[1]
    },
    leltarkorzet () {
      return this.eszkoz.id && this.eszkoz.akt_leltarkorzet_id[1]
    },
    hasznalo () {
      return this.eszkoz.id && this.eszkoz.akt_hasznalo_id[1]
    }
  },

  methods: {
    utc2local (utc) {
      return new Date(utc.replace(/ /, 'T') + 'Z').toLocaleString()
    },

    async onChange () {
      let params = { domain: [['leltari_szam', '=', this.leltariSzam]], frontend: true }
      let response = await API.get('vir/searchRead/leltar.eszkoz' + queryParams(params))
      if (response.ok && response.data.length) {
        this.eszkoz = response.data[0]
        console.log('eszkoz', this.eszkoz)

        params = { domain: [['eszkoz_id', '=', this.eszkoz.id]], frontend: true }
        response = await API.get('vir/searchRead/leltar.eszkozmozgas' + queryParams(params))
        this.mozgas = response.data
        console.log('mozgas', this.mozgas)
      } else {
        this.eszkoz = {}
        this.mozgas = []
        EventBus.$emit('inform', { type: 'alert', variation: 'warning', message: 'Hibás leltári szám!' })
      }
    }
  },

  created () {
    this.$store.set('title', 'Tárgyi eszköz információk')
  }
}
</script>
