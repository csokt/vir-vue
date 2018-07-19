<template>
  <div>
    <h3>{{ msg }}</h3>
    PIN kód: <input v-model="pin"><br>
    <button v-on:click="enter">Enter button</button><br>
  </div>
</template>

<script>
import Store from '@/store'

export default {
  name: 'pinSetup',
  props: {
    msg: String
  },

  components: {
  },

  data () {
    return {
      store: Store,
      pin: ''
    }
  },

  methods: {
    enter () {
      localStorage.szefo_pin = this.pin
      this.store.pin = this.pin
    }
  }
}
</script>
