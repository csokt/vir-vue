<template>
  <v-dialog v-model="params.dialog" persistent max-width="400">
    <v-card>
      <v-card-title>
        {{params.title}}
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="content"
          :readonly="params.readonly"
          :label="params.label"
          single-line
          append-outer-icon="send"
          @click:append-outer="onDecode()"
        ></v-text-field>
      </v-card-text>
      <v-img :contain="false">
        <QrcodeReader :paused="paused" @decode="onDecode" :track="false"></QrcodeReader>
      </v-img>
    </v-card>
  </v-dialog>
<!--
  <div v-if="content">{{ content }}</div>
-->
</template>

<script>
import { QrcodeReader } from 'vue-qrcode-reader'

export default {
  name: 'qreader',

  props: {
    params: {
      type: Object,
      default: undefined
    }
  },

  data () {
    return {
      // dialog: false,
      paused: false,
      content: null
    }
  },

  components: {
    QrcodeReader
  },

  methods: {
    onDecode (content) {
      if (content) { this.content = content }
      if (!this.content) { return }
      this.paused = true
      this.$emit('decode', content)
    }
  },

  created () {
  }
}
</script>
