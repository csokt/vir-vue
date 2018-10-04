<template>
  <v-autocomplete
    v-model="model"
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
    apiUrl: {
      type: String
    },

    label: {
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
    items: [],
    model: null
  }),

  methods: {
    onChange () {
      this.$emit('input', this.model)
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
