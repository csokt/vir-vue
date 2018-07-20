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
import { EventBus, getUser, getVirUser } from '@/util.js'
import Store from '@/store'

export default {
  name: 'loopbackLogin',
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
      // const response = await API.post('Users/login', {username: this.username, password: this.password})
      const response = await API.post('Users/login', {username: 'acsai', password: '1966'})
      // const response = await API.post('Users/login', {username: 'acsaine', password: '1963'})
      if (response.ok) {
        const token = response.data.id
        localStorage.szefo_loopback_token = token
        API.setHeader('Authorization', token)
        Store.pin = localStorage.szefo_pin
        getUser(this)
        getVirUser(this)
      } else {
        EventBus.$emit('inform', {type: 'alert', variation: 'warning', message: response.problem})
      }
    }
  }
}
</script>
