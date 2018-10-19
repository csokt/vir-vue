<template>
  <Qlookup
    :value="value"
    @input="$emit('input', $event)"
    label="Leltári szám"
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
  name: 'eszkoz',
  components: {
    Qlookup
  },

  props: {
    value: String,
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
