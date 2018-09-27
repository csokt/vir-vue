<template>
  <div>
    <v-text-field
      v-model="value"
      :label="label"
      readonly
      @focus="onFocus"
      append-outer-icon="select_all"
      @click:append-outer="readQR()"
    >
    </v-text-field>
    <Qreader
      :value="value"
      :label="label"
      :dialog="dialog"
      :required="required"
      :readonly="readonly"
      @input="onInput"
      @change="onChange"
      @back="onBack"
    />
  </div>
</template>

<script>
import Qreader from './Qreader.vue'

export default {
  name: 'qfield',

  props: {
    value: {
      type: String
    },
    label: {
      type: String,
      default: ''
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
      dialog: false
    }
  },

  components: {
    Qreader
  },

  methods: {
    onFocus () {
      if (!this.value) {
        this.dialog = true
      }
    },
    readQR () {
      this.dialog = true
    },
    onInput (content) {
      this.dialog = false
      this.$emit('input', content)
    },
    onChange (content) {
      this.dialog = false
      this.$emit('change', content)
    },
    onBack () {
      this.dialog = false
    }
  }
}
</script>
