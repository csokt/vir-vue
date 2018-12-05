<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="400"
  >
    <v-card>
      <v-card-title
        class="title grey--text"
        @click.stop="onBack"
      >
        <v-icon v-if="!required">
          arrow_back
        </v-icon>
        {{label}}
      </v-card-title>
      <v-img :contain="false">
        <QrcodeReader
          :camera="camera"
          :paused="!dialog"
          :track="false"
          @decode="onDecode"
        />
      </v-img>
    </v-card>
  </v-dialog>
</template>

<script>
import { QrcodeReader } from 'vue-qrcode-reader'

export default {
  components: {
    QrcodeReader
  },

  props: {
    label: String,
    dialog: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    camera () {
      if (this.$vuetify.breakpoint.smAndDown) {
        return {}
      }
      return { facingMode: 'user' }
    }
  },

  methods: {
    onDecode (content) {
      if (content) this.$emit('input', content)
    },

    onBack () {
      if (!this.required) this.$emit('back')
    }
  }
}
</script>
