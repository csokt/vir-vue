<template>
  <div>
    <v-text-field
      v-if="filter === 'eszkoz'"
      v-for="row in mozgas"
      :key="row.id"
      v-model="row.hova_leltarkorzet_id[1]"
      :label="utc2local(row.create_date)"
      readonly
      @click.stop="$emit('select', row)"
    />
    <v-text-field
      v-if="filter === 'erkeztetes'"
      v-for="row in mozgas"
      :key="row.id"
      v-model="row.eszkoz_id[1]"
      :label="row.hova_leltarkorzet_id[1]"
      readonly
      @click.stop="$emit('select', row)"
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
    eszkozId: Number
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
    eszkozId: function () {
      this.readMozgas()
    }
  },

  methods: {
    async readMozgas () {
      let params
      if (this.filter === 'eszkoz' && this.eszkozId) {
        params = { domain: [['eszkoz_id', '=', this.eszkozId]], frontend: true }
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
  }
}
</script>
