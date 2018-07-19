<template>
  <div>
    <h3>{{ msg }}</h3>
    login name: <input v-model="username"><br>
    password: <input v-model="password"><br>
    <button v-on:click="login">Login button</button><br>
  </div>
</template>

<script>
// import API from '@/backend/rest.js'
import { virLogin } from '@/backend/rest.js'
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
    login () {
      // virLogin(this.username, this.password)
      virLogin()
      // login()
    }
  }
}
</script>
