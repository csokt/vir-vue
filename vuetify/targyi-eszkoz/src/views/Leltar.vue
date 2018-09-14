<template>
  <v-container fluid>
      <v-layout column align-center>
        Leltár
      </v-layout>
  </v-container>
</template>

<script>

export default {
  name: 'leltar',
  data () {
    return {
    }
  },

  components: {
  },

  created () {
    this.$store.commit('setPageTitle', 'Tárgyi eszköz leltár')
  }
}
</script>
