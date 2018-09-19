<template>
  <v-container fluid>
      <v-layout column align-center>
        Üdvözlöm {{user.name}}!
      </v-layout>
  </v-container>
</template>

<script>
import { get } from 'vuex-pathify'

export default {
  name: 'home',
  data () {
    return {
    }
  },

  computed: get(['user']),

  components: {
  },

  created () {
    this.$store.set('title', 'Tárgyi eszközök')
  }
}
</script>
