<template>
  <div>
    <v-textarea
      v-for="row in eszkozok"
      :key="row.id"
      v-model="row.eszkoz_id[1]"
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
    filter: String, // uj, fellelt, hiany
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
      if (!this.leltarivId) {
        this.eszkozok = []
        this.$emit('length', 0)
        return
      }
      let params
      if (this.filter === 'uj') {
        params = { domain: [['leltariv_id', '=', this.leltarivId], ['leltariv_ujeszkoz_id', '>', 0]] }
      } else if (this.filter === 'fellelt') {
        params = { domain: [['leltariv_id', '=', this.leltarivId], ['fellelheto', '=', true]] }
      } else if (this.filter === 'hiany') {
        params = { domain: [['leltariv_id', '=', this.leltarivId], ['fellelheto', '=', false]] }
      } else {
        return
      }
      const response = await API.get('vir/searchRead/leltar.leltariv_osszes?params=' + JSON.stringify(params))
      if (!checkResponse(response)) return
      this.eszkozok = response.data
      this.$emit('length', this.eszkozok.length)
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
