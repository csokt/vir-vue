<template>
  <div>
    <v-textarea
      v-for="row in eszkozok"
      :key="row.id"
      v-model="row.name"
      :label="utc2local(row.write_date)"
      rows="1"
      auto-grow
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
    reloadTrigger: Boolean,
    hasznaloId: Number
  },

  data () {
    return {
      eszkozok: []
    }
  },

  watch: {
    reloadTrigger: function () {
      this.readEszkozok()
    },
    hasznaloId: function () {
      this.readEszkozok()
    }
  },

  methods: {
    async readEszkozok () {
      if (!this.hasznaloId) { this.eszkozok = []; return }
      const params = { domain: [['akt_hasznalo_id', '=', this.hasznaloId]] }
      const response = await API.get('vir/searchRead/leltar.eszkoz?params=' + JSON.stringify(params))
      this.eszkozok = response.data
    },

    utc2local (utc) {
      return new Date(utc.replace(/ /, 'T') + 'Z').toLocaleString()
    }
  }
}
</script>
