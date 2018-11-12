<template>
  <div>
    <v-text-field
      :value="value"
      :label="label"
      @input="$emit('input', $event)"
      @change="$emit('change', $event)"
      append-outer-icon="select_all"
      @click:append-outer="dialog = true"
    />
    <Qreader
      :label="label"
      :dialog="dialog"
      :required="required"
      @input="dialog = false; $emit('input', $event); $emit('change', $event)"
      @back="dialog = false"
    />
  </div>
<!--
      readonly
      @focus="dialog = !value"
-->
</template>

<script>
import Qreader from './Qreader.vue'

export default {
  components: {
    Qreader
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
  }
}
</script>
