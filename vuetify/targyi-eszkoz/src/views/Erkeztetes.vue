<template>
    <v-autocomplete
      v-model="model"
      :items="items"
      :loading="isLoading"
      :search-input.sync="search"
      clearable
      hide-details
      hide-selected
      item-text="name"
      item-value="symbol"
      label="Search for a coin..."
    >
      <template
        slot="item"
        slot-scope="{ item }"
      >
        {{ item }}
      </template>
    </v-autocomplete>
</template>

<script>
import axios from 'axios'
export default {
  data: () => ({
    isLoading: false,
    items: [],
    model: null,
    search: null
  }),

  watch: {
    search (val) {
      // Items have already been loaded
      if (this.items.length > 0) return

      this.isLoading = true

      // Lazily load input items
      axios.get('https://api.coinmarketcap.com/v2/listings/')
        .then(res => {
          this.items = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoading = false))
    }
  }
}
</script>
