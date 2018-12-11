<template>
  <div>
    <BaseQfield
      :value="value"
      :label="label"
      :focus="focus"
      @input="$emit('input', $event)"
      @change="onChange"
    />
    <ApiGet
      :apiUrl="apiUrl"
      :watchApiUrl="false"
      expect="object"
      @apiGetHandler="onApiGetHandler"
      @input="onApiInput"
    />
  </div>
</template>

<script>
import { EventBus } from '@/util'
import ApiGet from '@/components/base/ApiGet.vue'
import BaseQfield from '@/components/base/BaseQfield.vue'

export default {
  name: 'qlookup',
  components: {
    ApiGet,
    BaseQfield
  },

  props: {
    value: String,
    label: String,
    focus: Boolean,
    apiUrl: {
      type: String,
      required: true
    },
    notFoundMessage: {
      type: String,
      default: 'A keresett adat nem található!'
    }
  },

  methods: {
    onChange (content) {
      this.apiGet()
    },

    onApiGetHandler (content) {
      this.$emit('apiGetHandler', content)
      this.apiGet = content
    },

    onApiInput (content) {
      this.$emit('change', content)
      if (this.value && Object.keys(content).length === 0) {
        EventBus.$emit('inform', { type: 'alert', variation: 'warning', message: this.notFoundMessage })
      }
    }
  }
}
</script>
