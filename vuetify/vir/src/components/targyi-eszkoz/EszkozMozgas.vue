<template>
  <SmartList
    ref="smartlist"
    :apiUrl="apiUrl"
    :value="model"
    :label="label"
    @select="$emit('select', $event)"
  />
<!--
-->
</template>

<script>
import { utc2local } from '@/util'
import SmartList from '@/components/core/SmartList.vue'

export default {
  components: {
    SmartList
  },

  props: {
    eszkozId: Number
  },

  computed: {
    apiUrl () {
      if (!this.eszkozId) {
        return ''
      }
      const params = { domain: [['eszkoz_id', '=', this.eszkozId]] }
      return 'vir/searchRead/leltar.eszkozmozgas?params=' + JSON.stringify(params)
    }
  },

  methods: {
    model (item) {
      return item.hova_leltarkorzet_id[1]
    },

    label (item) {
      return utc2local(item.create_date)
    },

    reload () {
      this.$refs.smartlist.reload()
    }
  }
}
</script>
