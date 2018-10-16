<template>
  <v-autocomplete
    :value="value"
    @input="$emit('input', $event)"
    :items="items"
    :loading="isLoading"
    :search-input.sync="search"
    clearable
    @click:clear="items = []"
    no-filter
    hide-no-data
    :item-text="itemText"
    :item-value="itemValue"
    :label="label"
    @change="onChange"
  >
    <template
      slot="selection"
      slot-scope="{ item }"
    >
      <span class="mt-2"> {{ item[itemText] }} </span>
    </template>
    <template
      slot="item"
      slot-scope="{ item }"
    >
      <span :class="itemClass"> {{ item[itemText] }} </span>
    </template>
  </v-autocomplete>
<!--
-->
</template>

<script>
import { API } from '@/util'

export default {
  props: {
    value: [String, Number],
    label: String,
    apiUrl: Function,
    itemText: {
      type: String,
      default: 'name'
    },
    itemValue: {
      type: String,
      default: 'id'
    },
    itemClass: {
      type: String,
      // default: 'title'
      default: 'subheading'
      // default: 'body-2'
      // default: 'body-1'
      // default: 'caption'
    }
  },

  data: () => ({
    isLoading: false,
    search: null,
    items: []
  }),

  watch: {
    async search (content) {
      console.log('content2', content)
      // if (!content) { this.items = []; return }
      if (!content) { return }
      this.isLoading = true
      const response = await API.get(this.apiUrl(content))
      this.isLoading = false
      if (response.ok) {
        this.items = response.data
      }
    }
  },

  methods: {
    onChange (content) {
      const obj = this.items.find(o => o[this.itemValue] === content) || {}
      this.$emit('change', obj)
    }
  }
}
</script>
