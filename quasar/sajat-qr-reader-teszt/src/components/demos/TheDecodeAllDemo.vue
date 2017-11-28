<template>
<div>
  <div> {{ content }}</div>
  <QrcodeReader @decode="onDecode"> </QrcodeReader>
</div>
</template>

<script>
// import { QrcodeReader } from 'vue-qrcode-reader'
import QrcodeReader from '../QrcodeReader.vue'

export default {
  components: { QrcodeReader },

  data () {
    return {
      content: ''
    }
  },

  methods: {
    onDecode (content) {
      this.content = content
    }
  }
}
</script>
