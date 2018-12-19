<template>
  <SmartLookup
    ref="smartlookup"
    :value="value"
    label="Leltári szám"
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
  name: 'eszkoz',
  components: {
    SmartLookup
  },

  props: {
    value: String
  },

  computed: {
    apiUrl () {
      const params = { domain: [['leltari_szam', '=', this.value]] }
      return 'vir/searchRead/leltar.eszkoz?params=' + JSON.stringify(params)
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
