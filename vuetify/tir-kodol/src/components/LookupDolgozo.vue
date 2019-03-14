<template>
  <SmartLookup
    ref="smartlookup"
    :value="value"
    label="Dolgozó kód"
    qrcode
    :apiUrl="apiUrl"
    @input="$emit('input', $event)"
    @change="$emit('change', $event)"
  />
<!--
-->
</template>

<script>
import SmartLookup from '@/components/core/SmartLookup.vue'

export default {
  components: {
    SmartLookup
  },

  props: {
    value: String
  },

  computed: {
    apiUrl () {
      if (!this.value) {
        return ''
      }
      return 'tir/dolgozok/' + this.value
    }
  },

  methods: {
    reload () {
      this.$refs.smartlookup.reload()
    },

    focus () {
      this.$refs.smartlookup.focus()
    },

    blur () {
      this.$refs.smartlookup.blur()
    }
  }
}
</script>
