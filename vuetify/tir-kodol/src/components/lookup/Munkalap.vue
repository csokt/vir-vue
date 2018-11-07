<template>
  <Qlookup
    :value="value"
    @input="$emit('input', $event)"
    label="Munkalap"
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
      return 'tir/munkalapok/' + content.toString()
    }
  }
}
</script>
