<template>
  <v-autocomplete
    :value="value"
    :items="items"
    :loading="isLoading"
    clearable
    open-on-clear
    hide-no-data
    hide-selected
    :item-text="itemText"
    :item-value="itemValue"
    :label="label"
    return-object
    @change="onChange"
  />
</template>

<script>
import { API } from '@/util'

export default {
  props: {
    value: {
      type: Object
    },

    label: {
      type: String
    },

    apiUrl: {
      type: String
    },

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
      this.$emit('input', content)
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
