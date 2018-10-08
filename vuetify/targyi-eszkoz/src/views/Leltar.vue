<template>
  <v-container fluid>
      <v-layout column align-center>
        Leltár
        <v-text-field
          v-model="textField"
          label="Text field"
        />
        <Qreader
          v-model="qreader"
          label="qreader"
          :dialog="dialog"
          :required="false"
          :readonly="false"
          @input="onInput"
          @change="onChange"
          @back="onBack"
        />
        <Qfield
          v-model="qfield"
          label="qfield"
          @change="onChange"
        />
        <Qlookup
          v-model="qlookup"
          label="Leltári szám"
          propValue="leltari_szam"
          :apiUrl="apiUrl"
          @change="onChange"
        />
      </v-layout>
  </v-container>
</template>

<script>
import Qreader from '@/components/base/Qreader.vue'
import Qfield from '@/components/base/Qfield.vue'
import Qlookup from '@/components/base/Qlookup.vue'

export default {
  name: 'leltar',
  components: {
    Qreader,
    Qfield,
    Qlookup
  },

  data () {
    return {
      textField: '',
      qreader: '',
      dialog: false,
      qfield: '',
      qlookup: ''
    }
  },

  methods: {
    apiUrl (content) {
      const params = { domain: [['leltari_szam', '=', content]], frontend: true }
      return 'vir/searchRead/leltar.eszkoz?params=' + JSON.stringify(params)
    },

    onInput (content) {
      this.dialog = false
      console.log('onInput', content)
    },
    onChange (content) {
      console.log('onChange', content)
    },
    onBack () {
      this.dialog = false
      console.log('onBack')
    }
  },

  created () {
    this.$store.set('title', 'Tárgyi eszköz leltár')
  }
}
</script>
