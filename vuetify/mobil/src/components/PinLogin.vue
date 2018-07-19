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
  name: 'pinLogin',
  props: {
    msg: String
  },

  components: {
  },

  data () {
    return {
      store: Store,
      counter: 0,
      pin: ''
    }
  },

  methods: {
    enter () {
      if (this.counter < 3) this.store.pin = this.pin
      else this.store.user = null
      this.counter += 1
    }
  }
}
</script>
