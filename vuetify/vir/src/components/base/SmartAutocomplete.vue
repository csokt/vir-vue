<template>
  <v-autocomplete ref="element"
    :value="value"
    :items="items"
    :loading="isLoading"
    :search-input.sync="searchInput"
    clearable
    no-filter
    hide-no-data
    :item-text="itemText"
    :item-value="itemValue"
    :label="label"
    @input="$emit('input', $event)"
    @click:clear="items = []"
    @change="onChange"
  >
    <template
      slot="selection"
      slot-scope="{ item }"
    >
      <span class="mt-2">
        {{ item[itemText] }}
      </span>
    </template>
    <template
      slot="item"
      slot-scope="{ item }"
    >
      <span :class="itemClass">
        {{ item[itemText] }}
      </span>
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
    parentSearch: String,
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
    searchInput: null,
    items: []
  }),

  watch: {
    searchInput (content) {
      // console.log('searchInput:', content)
      this.search(content)
    },

    parentSearch (content) {
      this.search(content, true)
    },

    value (content) {
      if (!content) {
        this.items = []
        this.$emit('change', {})
      }
    }
  },

  methods: {
    async search (content, parent = false) {
      // console.log('search:', content)
      if (content === null) {
        return
      }
      this.isLoading = true
      const response = await API.get(this.apiUrl(content))
      this.isLoading = false
      if (response.ok) {
        this.items = response.data
        // console.log('this.items:', this.items)
        if (parent && !this.items.length) {
          this.$emit('change', {})
        }
      }
    },

    onChange (content) {
      this.$refs.element.blur()
      const obj = this.items.find(o => o[this.itemValue] === content) || {}
      this.$emit('change', { ...obj })
    }
  },

  created () {
    if (this.parentSearch) {
      this.search(this.parentSearch, true)
    }
  }
}
</script>
