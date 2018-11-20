<template>
  <div>
    <v-textarea
      v-for="row in keszlet"
      :key="row.id"
      v-model="row.raktaron"
      :label="row.hely_id[1]"
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
import { API, checkResponse } from '@/util'

export default {
  props: {
    reloadTrigger: Boolean,
    cikkId: Number
  },

  data () {
    return {
      keszlet: []
    }
  },

  watch: {
    reloadTrigger: function () {
      this.readKeszlet()
    },
    cikkId: function () {
      this.readKeszlet()
    }
  },

  methods: {
    async readKeszlet () {
      if (!this.cikkId) { this.keszlet = []; return }
      const params = { domain: [['cikk_id', '=', this.cikkId], ['szefo_e', '=', true], ['raktaron', '!=', 0]] }
      const response = await API.get('vir/searchRead/chance.keszlet?params=' + JSON.stringify(params))
      if (!checkResponse(response)) return
      this.keszlet = response.data
    },

    utc2local (utc) {
      return new Date(utc.replace(/ /, 'T') + 'Z').toLocaleString()
    }
  }
}
</script>
