<template>
  <SmartLookup
    :value="value"
    label="Leltári szám"
    :focus="focus"
    :apiUrl="apiUrl"
    @input="$emit('input', $event)"
    @change="$emit('change', $event)"
    @apiGetHandler="onApiGetHandler"
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

  computed: {
    apiUrl () {
      const params = { domain: [['leltari_szam', '=', this.value]] }
      return 'vir/searchRead/leltar.eszkoz?params=' + JSON.stringify(params)
    }
  },

  watch: {
    reloadTrigger: function () {
      this.apiGet()
    }
  },

  methods: {
    onApiGetHandler (content) {
      this.$emit('apiGetHandler', content)
      this.apiGet = content
    }
  }
}
</script>
