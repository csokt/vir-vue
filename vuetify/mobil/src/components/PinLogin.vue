<template>
  <div>
    <h3>{{ msg }}</h3>
    PIN kód: <input v-model="pin"><br>
    <button v-on:click="enter">Enter button</button><br>
  </div>
</template>

<script>
import { EventBus } from '@/util.js'
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
      if (this.counter < 3) {
        this.store.pin = this.pin
        EventBus.$emit('inform', {type: 'alert', variation: 'info', message: 'PIN elküldve'})
      } else {
        this.store.user = null
        EventBus.$emit('inform', {type: 'alert', variation: 'warning', message: 'PIN hiba'})
      }
      this.counter += 1
    }
  }
}
</script>
