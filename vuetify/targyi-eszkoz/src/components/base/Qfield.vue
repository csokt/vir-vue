<template>
  <div>
    <v-text-field
      :value="value"
      :label="label"
      readonly
      @focus="dialog = !value"
      append-outer-icon="select_all"
      @click:append-outer="dialog = true"
    >
    </v-text-field>
    <Qreader
      :value="value"
      :label="label"
      :dialog="dialog"
      :required="required"
      :readonly="readonly"
      @input="dialog = false; $emit('input', $event)"
      @change="$emit('change', $event)"
      @back="dialog = false"
    />
  </div>
</template>

<script>
import Qreader from './Qreader.vue'

export default {
  name: 'qfield',
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
