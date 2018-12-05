<template>
  <SmartLookup
    :value="value"
    label="Leltári szám"
    :focus="focus"
    :apiUrl="apiUrl"
    :reloadTrigger="reloadTrigger"
    @input="$emit('input', $event)"
    @change="$emit('change', $event)"
  />
<!--
-->
</template>

<script>
import SmartLookup from '@/components/base/SmartLookup.vue'

export default {
  name: 'eszkoz',
  components: {
    SmartLookup
  },

  props: {
    value: String,
    focus: Boolean,
    reloadTrigger: Boolean
  },

  methods: {
    apiUrl (content) {
      const params = { domain: [['leltari_szam', '=', content]] }
      return 'vir/searchRead/leltar.eszkoz?params=' + JSON.stringify(params)
    }
  }
}
</script>
