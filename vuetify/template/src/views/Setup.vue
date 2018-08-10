<template>
  <v-container fluid fill-height grid-list-lg>
    <v-layout  justify-center wrap>
    </v-layout>
  </v-container>
</template>

<script>
import Store from '@/store'

export default {
  name: 'setup',
  data () {
    return {
      store: Store
    }
  },

  components: {
  },

  created () {
    this.store.pageTitle = 'Beállítások'
  }

}
</script>
