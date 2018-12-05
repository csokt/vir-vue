<template>
  <SmartLookup
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
import SmartLookup from '@/components/base/SmartLookup.vue'

export default {
  components: {
    SmartLookup
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
