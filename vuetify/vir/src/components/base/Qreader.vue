<template>
  <v-dialog v-model="dialog" persistent max-width="400">
    <v-card>
      <v-card-text>
        <v-text-field
          :value="value"
          @input="lazyValue = $event"
          :rules="[rules.required]"
          :readonly="readonly"
          :single-line="readonly"
          :label="label"
          @keyup.enter="onDecode(lazyValue)"
          :prepend-icon="required ? '' : 'arrow_back'"
          @click:prepend="onBack"
          :append-outer-icon="readonly ? '' : 'send'"
          @click:append-outer="onDecode(lazyValue)"
        >
        </v-text-field>
      </v-card-text>
      <v-img :contain="false">
        <QrcodeReader
          :camera="camera"
          :paused="!dialog"
          :track="false"
          @decode="onDecode"
        >
        </QrcodeReader>
      </v-img>
    </v-card>
  </v-dialog>
<!--
-->
</template>

<script>
import { QrcodeReader } from 'vue-qrcode-reader'

export default {
  name: 'qreader',

  components: {
    QrcodeReader
  },

  props: {
    value: String,
    label: String,
    dialog: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      lazyValue: '',
      rules: {
        required: v => !this.required || !!v || 'Töltse ki ezt a mezőt.'
      }
    }
  },

  computed: {
    camera () {
      if (this.$vuetify.breakpoint.xs) {
        return {}
      }
      return { facingMode: 'user' }
    }
  },

  watch: {
    value: function (newValue) {
      this.$emit('change', newValue)
    }
  },

  methods: {
    onDecode (content) {
      // console.log('onDecode', content)
      if (this.required && !content) { return }
      this.$emit('input', content)
    },
    onBack () {
      // console.log('onBack')
      this.$emit('back')
    }
  }
}
</script>
