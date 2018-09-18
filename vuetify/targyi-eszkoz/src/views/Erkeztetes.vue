<template>
  <v-container fluid>
      <v-layout column align-center>
        Érkeztetés
      </v-layout>
  </v-container>
</template>

<script>

export default {
  name: 'erkeztetes',
  data () {
    return {
    }
  },

  components: {
  },

  created () {
    this.$store.set('title', 'Tárgyi eszköz érkeztetés')
  }
}
</script>
