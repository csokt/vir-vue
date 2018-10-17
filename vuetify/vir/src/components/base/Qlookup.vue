<template>
  <Qfield
    :value="value"
    @input="$emit('input', $event)"
    :label="label"
    required
    @change="onChange"
  />
</template>

<script>
import { API, EventBus } from '@/util'
import Qfield from '@/components/base/Qfield.vue'

export default {
  name: 'qlookup',
  components: {
    Qfield
  },

  props: {
    value: String,
    label: String,
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
      if (response.ok && response.data.length) {
        this.$emit('change', response.data[0])
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
