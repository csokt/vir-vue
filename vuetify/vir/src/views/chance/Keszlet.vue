<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <Card>
        <v-card-text>
          <Autocomplete ref="hely" v-model="helyId" label="Hely" itemClass="body-2" :apiUrl="apiUrl" @change="hely = $event; $refs.cikkszam.focus()"/>
          <v-text-field ref="cikkszam" v-model="cikkszam" label="Cikkszám" clearable @keyup.enter="$refs.megnevezes.focus()"/>
          <v-text-field ref="osztaly" mask="N" v-model="osztaly" label="Osztály" clearable @keyup.enter="$refs.megnevezes.focus()"/>
          <v-text-field ref="megnevezes" v-model="cikk.megnevezes" label="Megnevezés" readonly/>
        </v-card-text>
      </Card>

      <Card title="Készlet">
        <v-card-text>
          <KeszletTable :searchParams="keszletSearchParams"/>
        </v-card-text>
      </Card>
    </v-layout>
  </v-container>
<!--
-->
</template>

<script>
import { API } from '@/util'
import Card from '@/components/base/Card.vue'
import Autocomplete from '@/components/base/Autocomplete.vue'
import KeszletTable from '@/components/chance/KeszletTable.vue'

export default {
  name: 'keszlet',
  components: {
    Card,
    Autocomplete,
    KeszletTable
  },

  data () {
    return {
      helyId: 0,
      cikkszam: '',
      osztaly: '1',
      hely: {},
      cikk: {}
    }
  },

  computed: {
    keszletSearchParams () {
      if (!this.hely.id || !this.cikk.id || !this.osztaly) return ''
      const params = { domain: [['hely_id', '=', this.hely.id], ['cikkszam', '=', this.cikkszam], ['osztaly', '=', this.osztaly], ['szefo_e', '=', true], ['raktaron', '!=', 0]], limit: 200 }
      return JSON.stringify(params)
    }
  },

  watch: {
    cikkszam: async function () {
      this.cikk = {}
      if (this.cikkszam.length < 5) { return }
      const params = { domain: [['cikkszam', '=', this.cikkszam]], limit: 1 }
      const response = await API.get('vir/searchRead/chance.cikk?params=' + JSON.stringify(params))
      if (response.ok && response.data.length) {
        this.cikk = response.data[0]
      }
    }
  },

  methods: {
    apiUrl (content) {
      const params = { domain: [['name', 'ilike', content], ['szefo_e', '=', true]], order: 'name', limit: 10 }
      return 'vir/searchRead/chance.hely?params=' + JSON.stringify(params)
    }
  }
}
</script>
