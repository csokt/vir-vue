<template>
  <v-container fluid fill-height grid-list-lg>
    <v-layout  justify-center wrap>
    </v-layout>
  </v-container>
</template>

<script>
// @ is an alias to /src
import Store from '@/store'

export default {
  name: 'home',
  components: {
  },

  data () {
    return {
      store: Store
    }
  },

  created () {
    this.store.pageTitle = 'Kezdőoldal'
  },

  methods: {
  }
}
</script>
