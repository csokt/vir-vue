<template>
  <Qlookup
    :value="value"
    @input="$emit('input', $event)"
    label="Leltári szám"
    :apiUrl="apiUrl"
    @change="onChange"
  />
<!--
-->
</template>

<script>
import { API } from '@/util'
import Qlookup from '@/components/base/Qlookup.vue'

export default {
  name: 'eszkoz',
  components: {
    Qlookup
  },

  props: {
    value: String
  },

  data () {
    return {
    }
  },

  methods: {
    apiUrl (content) {
      const params = { domain: [['leltari_szam', '=', content]], frontend: true }
      return 'vir/searchRead/leltar.eszkoz?params=' + JSON.stringify(params)
    },

    async onChange (eszkoz) {
      this.$emit('change', eszkoz)
      if (eszkoz.id) {
        const params = { domain: [['eszkoz_id', '=', eszkoz.id]], frontend: true }
        const response = await API.get('vir/searchRead/leltar.eszkozmozgas?params=' + JSON.stringify(params))
        this.$emit('mozgas', response.data)
      } else {
        this.$emit('mozgas', [])
      }
    }
  }
}
</script>
