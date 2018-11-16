<template>
  <Qlookup
    :value="value"
    @input="$emit('input', $event)"
    label="Leltári szám"
    :focus="focus"
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
