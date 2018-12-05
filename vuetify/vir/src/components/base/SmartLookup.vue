<template>
  <BaseQfield
    :value="value"
    :label="label"
    :focus="focus"
    @input="$emit('input', $event)"
    @change="onChange"
  />
</template>

<script>
import { API, EventBus } from '@/util'
import BaseQfield from '@/components/base/BaseQfield.vue'

export default {
  name: 'qlookup',
  components: {
    BaseQfield
  },

  props: {
    value: String,
    label: String,
    focus: Boolean,
    apiUrl: Function,
    reloadTrigger: Boolean,
    notFoundMessage: {
      type: String,
      default: 'A keresett adat nem található!'
    }
  },

  watch: {
    reloadTrigger: function () {
      this.onChange(this.value)
    }
  },

  methods: {
    async onChange (content) {
      const response = await API.get(this.apiUrl(content))
      if (response.ok && Array.isArray(response.data) && response.data.length) {
        this.$emit('change', response.data[0])
      } else if (response.ok && typeof response.data === 'object' && response.data.constructor === Object) {
        this.$emit('change', response.data)
      } else {
        this.$emit('change', {})
        if (this.value) {
          EventBus.$emit('inform', { type: 'alert', variation: 'warning', message: this.notFoundMessage })
        }
      }
    }
  }
}
</script>
