<template>
  <div>
    <h3>{{ msg }}</h3>
    login name: <input v-model="username"><br>
    password: <input v-model="password"><br>
    <button v-on:click="login">Login button</button><br>
  </div>
</template>

<script>
import { API } from '@/backend/rest.js'
import { EventBus, getVirUser } from '@/util.js'
import Store from '@/store'

export default {
  name: 'virLogin',
  props: {
    msg: String
  },

  components: {
  },

  data () {
    return {
      store: Store,
      username: '',
      password: ''
    }
  },

  methods: {
    async login () {
      // const response = await API.post('vir/login', {username: this.username, password: this.password})
      const response = await API.post('vir/login', {username: 'hegedus.istvan', password: 'Godhak04'})
      if (response.ok) {
        getVirUser(this)
      } else {
        EventBus.$emit('inform', {type: 'alert', variation: 'warning', message: response.problem})
      }
    }
  }
}
</script>
