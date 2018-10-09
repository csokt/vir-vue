<template>
  <Qlookup
    :value="value"
    @input="$emit('input', $event)"
    label="Leltári szám"
    :apiUrl="apiUrl"
    @change="$emit('change', $event)"
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
    value: String
  },

  methods: {
    apiUrl (content) {
      const params = { domain: [['leltari_szam', '=', content]], frontend: true }
      return 'vir/searchRead/leltar.eszkoz?params=' + JSON.stringify(params)
    }
  }
}
</script>
