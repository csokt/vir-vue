<template>
  <v-container fluid>
      <v-layout column align-center>
        <Qfield v-model="leltariSzam" label="Leltári szám" required readonly/>
        <Qfield v-model="dummy" label="Dummy" />
      </v-layout>
  </v-container>
<!--
        <Qreader v-model="leltariSzam" :dialog="leltariSzamDialog" required readonly label="Leltári szám" @input="onLeltariSzamDecode" @back="onLeltariSzamBack"/>
        <Qfield v-model="leltariSzam"/>
-->
</template>

<script>
import Qreader from '@/components/base/Qreader.vue'
import Qfield from '@/components/base/Qfield.vue'

export default {
  name: 'info',
  data () {
    return {
      leltariSzam: '',
      dummy: '',
      leltariSzamDialog: true
    }
  },

  components: {
    Qreader,
    Qfield
  },

  methods: {
    onLeltariSzamDecode (content) {
      console.log('QR', content)
      this.leltariSzamDialog = false
    },
    onLeltariSzamBack () {
      console.log('back')
      this.leltariSzamDialog = false
    }
  },

  created () {
    this.$store.set('title', 'Tárgyi eszköz információk')
  }
}
</script>
