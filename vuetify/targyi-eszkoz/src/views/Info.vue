<template>
  <v-container fluid>
      <v-layout column align-center>
        <Qfield v-model="leltariSzam" label="Leltári szám" required @change="onChange"/>
      </v-layout>
  </v-container>
<!--
        <Qreader v-model="leltariSzam" :dialog="leltariSzamDialog" required readonly label="Leltári szám" @input="onLeltariSzamDecode" @back="onLeltariSzamBack"/>
        <Qfield v-model="leltariSzam" label="Leltári szám" required readonly/>
        <Qfield v-model="dummy" label="Dummy" />
-->
</template>

<script>
import { API } from '@/util'
import Qfield from '@/components/base/Qfield.vue'

function queryParams (params) {
  return '?params=' + JSON.stringify(params)
}

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
    Qfield
  },

  methods: {
    async onChange () {
      let params = { domain: [['leltari_szam', '=', this.leltariSzam]], frontend: true }
      let response = await API.get('vir/searchRead/leltar.eszkoz' + queryParams(params))
      if (response.ok && response.data.length) {
        console.log('data', response.data)
        this.eszkoz = response.data[0]

        params = { domain: [['eszkoz_id', '=', this.eszkoz.id]], frontend: true }
        response = await API.get('vir/searchRead/leltar.eszkozmozgas' + queryParams(params))
        this.mozgas = response.data
      } else {
        this.eszkoz = null
      }
    }
  },

  created () {
    this.$store.set('title', 'Tárgyi eszköz információk')
  }
}
</script>
