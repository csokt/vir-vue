<template>
  <v-container fluid>
      <v-layout column align-center>
        Info
        <Qreader @decode="onLeltariSzamDecode" :params="leltariSzamParams"/>
      </v-layout>
  </v-container>
</template>

<script>
import Qreader from '@/components/Qreader.vue'

export default {
  name: 'info',
  data () {
    return {
      leltariSzamParams: {
        dialog: true,
        readonly: false,
        keyboard: false,
        title: 'Leltári szám',
        label: 'Leltári szám'
      }
    }
  },

  components: {
    Qreader
  },

  methods: {
    onLeltariSzamDecode (content) {
      console.log('QR', content)
    }
  },

  created () {
    this.$store.set('title', 'Tárgyi eszköz információk')
  }
}
</script>
