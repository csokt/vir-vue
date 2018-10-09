<template>
  <v-autocomplete
    :value="value"
    @input="$emit('input', $event)"
    :items="items"
    :loading="isLoading"
    clearable
    open-on-clear
    hide-no-data
    hide-selected
    :item-text="itemText"
    :item-value="itemValue"
    :label="label"
    @change="onChange"
  />
<!--
-->
</template>

<script>
import { API } from '@/util'

export default {
  props: {
    value: [String, Number],
    label: String,
    apiUrl: String,
    itemText: {
      type: String,
      default: 'name'
    },
    itemValue: {
      type: String,
      default: 'id'
    }
  },

  data: () => ({
    isLoading: true,
    items: []
  }),

  methods: {
    onChange (content) {
      const obj = this.items.find(o => o[this.itemValue] === content) || {}
      this.$emit('change', obj)
    }
  },

  async created () {
    const response = await API.get(this.apiUrl)
    this.isLoading = false
    if (response.ok && response.data.length) {
      this.items = response.data
    }
  }
}
</script>
