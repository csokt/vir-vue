<template>
  <SmartList
    ref="smartlist"
    :apiUrl="apiUrl"
    :value="model"
    :label="label"
    @select="$emit('select', $event)"
    @length="$emit('length', $event)"
  />
</template>

<script>
import { utc2local } from '@/util'
import SmartList from '@/components/base/SmartList.vue'

export default {
  components: {
    SmartList
  },

  props: {
    filter: String, // uj, fellelt, hiany
    leltarivId: Number
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
        return ''
      }
      return 'vir/searchRead/leltar.leltariv_osszes?params=' + JSON.stringify(params)
    }
  },

  methods: {
    model (item) {
      return item.eszkoz_id[1]
    },

    label (item) {
      return utc2local(item.write_date)
    },

    reload () {
      this.$refs.apiget.reload()
    }
  }
}
</script>
