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
    <ApiGet
      ref="apiget"
      v-model="eszkozok"
      :apiUrl="apiUrl"
      expect="array"
    />
</div>
<!--
-->
</template>

<script>
import ApiGet from '@/components/base/ApiGet.vue'
import { utc2local } from '@/util'

export default {
  components: {
    ApiGet
  },

  props: {
    filter: String, // uj, fellelt, hiany
    leltarivId: Number
  },

  data () {
    return {
      eszkozok: []
    }
  },

  computed: {
    apiUrl () {
      if (!this.leltarivId) {
        return ''
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
      return 'vir/searchRead/leltar.leltariv_osszes?params=' + JSON.stringify(params)
    }
  },

  methods: {
    utc2local (utc) {
      return utc2local(utc)
    },

    reload () {
      this.$refs.apiget.reload()
    }
  }
}
</script>
