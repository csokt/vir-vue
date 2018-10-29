<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <Card>
        <v-card-text>
          <Autocomplete ref="hely" v-model="helyId" label="Hely" itemClass="body-2" :apiUrl="apiUrl" @change="hely = $event; $refs.cikkszam.focus()"/>
          <v-text-field ref="cikkszam" v-model="cikkszam" label="Cikkszám" clearable/>
          <v-text-field ref="osztaly" v-model="osztaly" label="Osztály" clearable/>
          <v-text-field v-model="cikk.megnevezes" label="Megnevezés" readonly/>
        </v-card-text>
      </Card>

      <Card title="Készlet">
        <v-data-table
          :headers="headers"
          :items="keszlet"
          hide-actions
        >
          <template slot="items" slot-scope="props">
            <td>{{ props.item.meret }}</td>
            <td>{{ props.item.szin }}</td>
            <td class="text-xs-right">{{ props.item.raktaron }}</td>
            <td class="text-xs-right">{{ props.item.vonalkod }}</td>
          </template>
        </v-data-table>
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

export default {
  name: 'keszlet',
  components: {
    Card,
    Autocomplete
  },

  data () {
    return {
      helyId: 0,
      cikkszam: '',
      osztaly: '1',
      helynev: '',
      hely: {},
      cikk: {},
      headers: [
        {
          text: 'Méret',
          value: 'meret',
          align: 'left'
        },
        { text: 'Szín', value: 'szin' },
        { text: 'Raktáron', value: 'raktaron' },
        { text: 'Vonalkód', value: 'vonalkod', sortable: false },
        { align: 'left', sortable: false, text: '', value: 'meret' }
      ],
      keszlet: [],
      message: ''
    }
  },

  computed: {
    keszletSearchParams () {
      if (!this.hely.id || !this.cikk.id || !this.osztaly) return ''
      const params = { domain: [['hely_id', '=', this.hely.id], ['cikkszam', '=', this.cikkszam], ['osztaly', '=', this.osztaly], ['szefo_e', '=', true]] }
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
    },

    keszletSearchParams: async function (params) {
      this.keszlet = []
      if (!params) { return }
      // const params = { domain: [['hely_id', '=', this.hely.id], ['cikkszam', '=', this.cikkszam], ['osztaly', '=', this.osztaly], ['szefo_e', '=', true]] }
      const response = await API.get('vir/searchRead/chance.keszlet?params=' + params)
      if (response.ok) {
        this.keszlet = response.data
      }
    }
  },

  methods: {
    apiUrl (content) {
      const params = { domain: [['name', 'ilike', content], ['szefo_e', '=', true]], order: 'name', limit: 10 }
      return 'vir/searchRead/chance.hely?params=' + JSON.stringify(params)
    },

    checkOsztaly (value) {
      this.osztaly = this.osztaly.toUpperCase()
      this.readKeszlet()
    }
  }
}
</script>

<style >
table.v-table tbody td:first-child, table.v-table tbody td:not(:first-child), table.v-table tbody th:first-child, table.v-table tbody th:not(:first-child), table.v-table thead td:first-child, table.v-table thead td:not(:first-child), table.v-table thead th:first-child, table.v-table thead th:not(:first-child) {
  padding: 0 10px;
}
</style>
