<template>
  <v-autocomplete
    v-model="model"
    :items="items"
    :loading="isLoading"
    clearable
    open-on-clear
    hide-no-data
    hide-selected
    item-text="name"
    item-value="id"
    label="Új leltárkörzet"
    prepend-icon="search"
    return-object
  />
</template>

<script>
import { API } from '@/util'

export default {
  data: () => ({
    isLoading: true,
    items: [],
    model: null
  }),

  async created () {
    const response = await API.get('vir/searchRead/leltar.korzet?params={}')
    this.isLoading = false
    if (response.ok && response.data.length) {
      this.items = response.data
    }
  }
}
</script>
