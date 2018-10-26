<template>
  <Qlookup
    :value="value"
    @input="$emit('input', $event)"
    label="Vonalkód"
    :apiUrl="apiUrl"
    @change="$emit('change', $event)"
    :reloadTrigger="reloadTrigger"
  />
<!--
-->
</template>

<script>
import Qlookup from '@/components/base/Qlookup.vue'

export default {
  components: {
    Qlookup
  },

  props: {
    value: String,
    reloadTrigger: Boolean
  },

  methods: {
    apiUrl (content) {
      const params = { domain: [['vonalkod', '=', content]] }
      return 'vir/searchRead/chance.cikk?params=' + JSON.stringify(params)
    }
  }
}
</script>
