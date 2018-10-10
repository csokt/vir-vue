<template>
  <div>
    <v-text-field
      v-if="filter === 'eszkoz'"
      v-for="row in mozgas"
      :key="row.id"
      v-model="row.hova_leltarkorzet_id[1]"
      :label="utc2local(row.create_date)"
      readonly
    />
    <v-text-field
      v-if="filter === 'erkeztetes'"
      v-for="row in mozgas"
      :key="row.id"
      v-model="row.eszkoz_id[1]"
      :label="row.hova_leltarkorzet_id[1]"
      readonly
    />
  </div>
<!--
-->
</template>

<script>
import { API } from '@/util'

export default {
  props: {
    filter: String,
    reloadTrigger: Boolean,
    eszkoz: Object
  },

  data () {
    return {
      mozgas: []
    }
  },

  watch: {
    reloadTrigger: function () {
      this.readMozgas()
    },
    eszkoz: function () {
      this.readMozgas()
    }
  },

  methods: {
    async readMozgas () {
      let params
      if (this.filter === 'eszkoz' && this.eszkoz) {
        params = { domain: [['eszkoz_id', '=', this.eszkoz.id]], frontend: true }
      } else if (this.filter === 'erkeztetes') {
        params = { domain: [['megerkezett', '=', false]], limit: 100, frontend: true }
      }
      if (params) {
        const response = await API.get('vir/searchRead/leltar.eszkozmozgas?params=' + JSON.stringify(params))
        this.mozgas = response.data
      } else {
        this.mozgas = []
      }
    },

    utc2local (utc) {
      return new Date(utc.replace(/ /, 'T') + 'Z').toLocaleString()
    }
  },

  created () {
  }
}
</script>
