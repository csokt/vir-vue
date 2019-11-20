<template>
  <SmartLookup
    ref="smartlookup"
    :value="value"
    label="Vonalkód"
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
      const params = { domain: [['vonalkod', '=', this.value]] }
      return 'vir/searchRead/chance.cikk?params=' + JSON.stringify(params)
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
