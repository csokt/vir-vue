<template>
  <div>
    <v-text-field
      ref="textfield"
      :value="value"
      :label="label"
      append-outer-icon="select_all"
      @input="$emit('input', $event)"
      @change="$emit('change', $event)"
      @click:append-outer="dialog = true"
    />
    <BaseQreader
      :label="label"
      :dialog="dialog"
      :required="required"
      @input="dialog = false; $emit('input', $event); $emit('change', $event)"
      @back="dialog = false"
    />
  </div>
</template>

<script>
import BaseQreader from './BaseQreader.vue'

export default {
  components: {
    BaseQreader
  },

  props: {
    value: String,
    label: String,
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

  methods: {
    focus () {
      this.$refs.textfield.focus()
    },

    blur () {
      this.$refs.textfield.blur()
    }
  }
}
</script>
