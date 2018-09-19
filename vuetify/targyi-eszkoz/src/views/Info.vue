<template>
  <v-container fluid>
      <v-layout column align-center>
        Info
        <Qreader @decode="onDecode"/>
      </v-layout>
  </v-container>
</template>

<script>
import Qreader from '@/components/Qreader.vue'

export default {
  name: 'info',
  data () {
    return {
    }
  },

  components: {
    Qreader
  },

  methods: {
    onDecode (content) {
      console.log('QR', content)
    }
  },

  created () {
    this.$store.set('title', 'Tárgyi eszköz információk')
  }
}
</script>
