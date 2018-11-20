<template>
  <div>
    <v-textarea
      v-for="row in eszkozok"
      :key="row.id"
      v-model="row.name"
      :label="row.leltarcsoport_id[1]"
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
    leltarkorzetId: Number
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
    leltarkorzetId: function () {
      this.readEszkozok()
    }
  },

  methods: {
    async readEszkozok () {
      if (!this.leltarkorzetId) { this.eszkozok = []; return }
      const params = { domain: [['akt_leltarkorzet_id', '=', this.leltarkorzetId]] }
      const response = await API.get('vir/searchRead/leltar.eszkoz?params=' + JSON.stringify(params))
      if (!checkResponse(response)) return
      this.eszkozok = response.data
    }
  }
}
</script>
