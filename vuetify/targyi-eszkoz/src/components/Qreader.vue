<template>

        <v-dialog v-model="dialog" persistent max-width="290" hide-overlay=true>
          <v-btn slot="activator" color="primary" dark>Open Dialog</v-btn>
          <v-card>
            <v-card-title class="headline">Use Google's location service?</v-card-title>
            <v-card-text>Let Google help apps determine location.</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" flat @click.native="dialog = false">Disagree</v-btn>
              <v-btn color="green darken-1" flat @click.native="dialog = false">Agree</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
<!--
        <div v-if="content">{{ content }}</div>
        <QrcodeReader :paused="paused" @decode="onDecode" :track="false"></QrcodeReader>
 -->
</template>

<script>
import { QrcodeReader } from 'vue-qrcode-reader'

export default {
  name: 'qreader',
  data () {
    return {
      dialog: false,
      paused: false,
      content: null
    }
  },

  components: {
    QrcodeReader
  },

  methods: {
    onDecode (content) {
      this.content = content
      this.paused = true
      this.$emit('decode', content)
    }
  },

  created () {
  }
}
</script>
