<template>
  <v-container fluid>
      <v-layout column align-center>
        Info
      </v-layout>
  </v-container>
</template>

<script>

export default {
  name: 'info',
  data () {
    return {
    }
  },

  components: {
  },

  created () {
    this.$store.set('title', 'Tárgyi eszköz információk')
  }
}
</script>
