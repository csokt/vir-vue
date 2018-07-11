<template>
  <div>
    <h3> Login component</h3>
    login name: <input v-model="username"><br>
    password: <input v-model="password"><br>
    <button v-on:click="login">Login button</button><br>
  </div>
</template>

<script>
// import API from '@/backend/rest.js'
import { login } from '@/backend/rest.js'
import Store from '@/store'

export default {
  name: 'loopbackLogin',
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
      login(this.username, this.password)
      // login()
    }
  }
}
</script>
