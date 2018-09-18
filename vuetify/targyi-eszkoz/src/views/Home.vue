<template>
  <v-container fluid>
      <v-layout column align-center>
        Üdvözlöm X Y!
      </v-layout>
  </v-container>
</template>

<script>

export default {
  name: 'home',
  data () {
    return {
    }
  },

  components: {
  },

  created () {
    this.$store.set('title', 'Tárgyi eszközök')
  }
}
</script>
