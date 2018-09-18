<template>
  <v-container fluid>
      <v-layout column align-center>
        Áthelyezés
      </v-layout>
  </v-container>
</template>

<script>

export default {
  name: 'athelyezes',
  data () {
    return {
    }
  },

  components: {
  },

  created () {
    this.$store.set('title', 'Tárgyi eszköz áthelyezés')
  }
}
</script>
