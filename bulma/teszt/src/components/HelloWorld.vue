<template>
  <div class="box">
    <button class="button" @click="onClick">Dialog</button>
    <BaseQreader
      label="QR teszt"
      :dialog="dialog"
      :required="false"
      @input="dialog = false; $emit('input', $event); $emit('change', $event)"
      @back="dialog = false"
    />
  </div>
</template>

<script>
import BaseQreader from '@/components/core/BaseQreader.vue'

export default {
  name: 'HelloWorld',

  components: {
    BaseQreader
  },

  props: {
    msg: String
  },

  data () {
    return {
      dialog: false
    }
  },

  methods: {
    onClick () {
      this.dialog = !this.dialog
      console.log('this.dialog', this.dialog)
    }
  }
}

</script>
