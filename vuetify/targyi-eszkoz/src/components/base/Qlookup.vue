<template>
  <Qfield
    v-model="qfieldValue"
    :label="label"
    required
  />
<!--
    @change="onChange"
-->
</template>

<script>
import { API } from '@/util'
import Qfield from '@/components/base/Qfield.vue'

export default {
  name: 'qlookup',
  components: {
    Qfield
  },

  props: {
    value: Object,
    label: String,
    apiUrl: Function,
    propValue: String
  },

  data () {
    return {
      qfieldValue: ''
    }
  },

  watch: {
    qfieldValue (val) {
      // console.log('qfieldValue', val)
      this.onChange(val)
    },

    value (val) {
      console.log('value', val)
      this.qfieldValue = this.value[this.propValue]
    }
  },

  methods: {
    async onChange (content) {
      const response = await API.get(this.apiUrl(content))
      if (response.ok && response.data.length) {
        const value = response.data[0]
        this.$emit('input', value)
        this.$emit('change', value)
      } else {
        this.$emit('input', {})
        this.$emit('change', {})
      }
    }
  }
}
</script>
