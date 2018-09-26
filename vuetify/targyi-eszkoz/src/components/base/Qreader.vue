<template>
  <v-dialog v-model="dialog" persistent max-width="400">
    <v-card>
      <v-card-text>
        <v-text-field
          v-model="content"
          :rules="[rules.required]"
          :readonly="readonly"
          :single-line="readonly"
          :label="label"
          @keyup.enter="onDecode()"
          :prepend-icon="required ? '' : 'arrow_back'"
          @click:prepend="onBack"
          :append-outer-icon="readonly ? '' : 'send'"
          @click:append-outer="onDecode()"
        >
        </v-text-field>
      </v-card-text>
      <v-img :contain="false">
        <QrcodeReader
          :paused="!dialog"
          :track="false"
          @decode="onDecode"
        >
        </QrcodeReader>
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
    value: {
      type: String
    },
    label: {
      type: String,
      default: ''
    },
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
      content: null,
      rules: {
        required: v => !this.required || !!v || 'Töltse ki ezt a mezőt.'
      }
    }
  },

  components: {
    QrcodeReader
  },

  methods: {
    onDecode (content) {
      if (content) { this.content = content }
      if (!this.content) { return }
      this.$emit('input', this.content)
      if (this.value !== this.content) {
        this.$emit('change', this.content)
      }
    },
    onBack () {
      this.content = this.value
      this.$emit('back')
    }
  },

  created () {
    this.content = this.value
  }
}
</script>
