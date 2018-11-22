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
import { API, utc2local, checkResponse } from '@/util'

export default {
  props: {
    reloadTrigger: Boolean,
    leltarivId: Number
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
    leltarivId: function () {
      this.readEszkozok()
    }
  },

  methods: {
    async readEszkozok () {
      if (!this.leltarivId) { this.eszkozok = []; return }
      const params = { domain: [['leltariv_id', '=', this.leltarivId]] }
      const response = await API.get('vir/searchRead/leltar.leltariv_ismeretlen?params=' + JSON.stringify(params))
      if (!checkResponse(response)) return
      this.eszkozok = response.data
    },

    utc2local (utc) { return utc2local(utc) }
  },

  created () {
    if (this.leltarivId) {
      this.readEszkozok()
    }
  }
}
</script>
