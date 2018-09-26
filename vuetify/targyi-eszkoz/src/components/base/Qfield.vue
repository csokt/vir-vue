<template>
  <div>
    <v-text-field
      v-model="content"
      :label="label"
      readonly
      @focus="onFocus"
      append-outer-icon="select_all"
      @click:append-outer="onReadQR()"
    >
    </v-text-field>
    <Qreader
      v-model="content"
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
      content: '',
      dialog: false
    }
  },

  components: {
    Qreader
  },

  methods: {
    onFocus () {
      if (!this.content) {
        this.dialog = true
      }
    },
    onReadQR () {
      this.dialog = true
    },
    onInput () {
      this.dialog = false
      this.$emit('input', this.content)
    },
    onChange () {
      this.dialog = false
      this.$emit('change', this.content)
    },
    onBack () {
      this.dialog = false
    }
  },

  created () {
    this.content = this.value
  }
}
</script>
