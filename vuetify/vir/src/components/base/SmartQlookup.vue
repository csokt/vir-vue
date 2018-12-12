<template>
  <div>
    <BaseQfield
      ref="textfield"
      :value="value"
      :label="label"
      @input="$emit('input', $event)"
      @change="onChange"
    />
    <ApiGet
      ref="apiget"
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
  components: {
    ApiGet,
    BaseQfield
  },

  props: {
    value: String,
    label: String,
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
    },

    reload () {
      this.$refs.apiget.reload()
    },

    focus () {
      this.$refs.textfield.focus()
    },

    blur () {
      this.$refs.textfield.blur()
    }
  }
}
</script>
