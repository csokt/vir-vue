<template>
  <v-dialog
    ref="dialog"
    v-model="modal2"
    :return-value.sync="time"
    persistent
    lazy
    full-width
    width="290px"
  >
    <v-text-field
      slot="activator"
      v-model="time"
      :label="label"
      prepend-icon="access_time"
      readonly
    ></v-text-field>
    <v-time-picker
      v-if="modal2"
      v-model="time"
      format="24hr"
      full-width
    >
      <v-spacer></v-spacer>
      <v-btn flat color="primary" @click="modal2 = false">Elvet</v-btn>
      <v-btn flat color="primary" @click="$refs.dialog.save(time); $emit('input', time)">Ment</v-btn>
    </v-time-picker>
  </v-dialog>
<!--
-->
</template>

<script>

export default {
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
      time: this.value,
      modal2: false
    }
  }
}
</script>
