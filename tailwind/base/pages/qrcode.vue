<template>
  <div>
    QR code component
    <br />
    <t-button @click="onClick" value="QR code"></t-button>
    <t-input v-model="qrcode" readonly></t-input>
    <TQread
      v-model="qrcode"
      :dialog="dialog"
      @input="dialog = false"
      @close="dialog = false"
      header="QR olvasás"
    >
    </TQread>
  </div>
</template>

<script>
import TButton from '@/components/ui/TButton.vue'
import TInput from '@/components/ui/TInput.vue'
import TQread from '@/components/ui/TQread.vue'

export default {
  components: {
    TButton,
    TInput,
    TQread
  },

  data() {
    return {
      qrcode: null,
      dialog: false
    }
  },

  methods: {
    onClick() {
      this.dialog = true
      // eslint-disable-next-line
      // console.log(this.$screen)
    }
  }
}
</script>
