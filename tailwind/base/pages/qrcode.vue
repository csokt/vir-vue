<template>
  <div>
    QR code component
    <br />
    <t-button @click="onClick" value="QR code"></t-button>
    <t-input v-model="qrcode" readonly label="Readonly"></t-input>
    <t-modal
      v-model="dialog"
      @close="dialog = false"
      header="QR olvasás"
      hide-close-button
    >
      <vue-qr-reader
        @code-scanned="codeArrived"
        :use-back-camera="useBackCamera"
        :video-width="videoWidth"
        :video-height="videoHeight"
      />
    </t-modal>
  </div>
</template>

<script>
import VueQrReader from 'vue-qr-reader/dist/lib/vue-qr-reader.umd.js'
import TButton from '@/components/ui/TButton.vue'
import TModal from '@/components/ui/TModal.vue'

export default {
  components: {
    VueQrReader,
    TButton,
    TModal
  },

  data() {
    return {
      qrcode: null,
      dialog: false
    }
  },

  computed: {
    useBackCamera() {
      return !this.$screen.md
    },
    videoWidth() {
      return this.$screen.portrait ? 300 : 400
    },
    videoHeight() {
      return this.$screen.landscape ? 300 : 400
    }
  },

  methods: {
    onClick() {
      this.dialog = true
      // eslint-disable-next-line
      // console.log(this.$screen)
    },

    codeArrived(code) {
      this.qrcode = code
      this.dialog = false
    }
  }
}
</script>
