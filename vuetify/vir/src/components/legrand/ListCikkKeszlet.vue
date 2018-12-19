<template>
  <SmartList
    ref="smartlist"
    :apiUrl="apiUrl"
    value="raktaron"
    :label="label"
    @select="$emit('select', $event)"
  />
</template>

<script>
import SmartList from '@/components/core/SmartList.vue'

export default {
  components: {
    SmartList
  },

  props: {
    cikkId: Number
  },

  computed: {
    apiUrl () {
      const params = { domain: [['cikk_id', '=', this.cikkId], ['szefo_e', '=', true], ['raktaron', '!=', 0]] }
      return 'vir/searchRead/legrand.keszlet?params=' + JSON.stringify(params)
    }
  },

  methods: {
    label (item) {
      return item.hely_id[1]
    },

    reload () {
      this.$refs.smartlist.reload()
    }
  }
}
</script>
