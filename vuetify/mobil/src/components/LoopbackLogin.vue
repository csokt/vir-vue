<template>
  <div class="home">
    name: <input v-model="name"><br>
    password: <input v-model="password"><br>
    <button v-on:click="login">Login</button><br>
    <button v-on:click="logout">Logout</button><br>
  </div>
</template>

<script>
import API from '@/rest.js'
import LoopbackLogin from '@/components/LoopbackLogin.vue'

export default {
  name: 'home',
  components: {
    LoopbackLogin
  },

  data () {
    return {
      name: '',
      password: ''
    }
  },

  methods: {
    async login () {
      const response = await API.post('Users/login', {'username': 'csok.tibor', 'password': 'X'})
      console.log(response)
      if (response.ok) {
        const token = response.data.id
        console.log('login', token)
        localStorage.setItem('SzefoLoopbackToken', token)
        API.setHeader('Authorization', token)
      } else {
        console.log(response.problem)
      }
    },

    async logout () {
      const response = await API.post('Users/logout')
      console.log(response)
      if (response.ok) {
        localStorage.removeItem('SzefoLoopbackToken')
        console.log('logged out')
      } else {
        console.log(response.problem)
      }
    }

  }
}
</script>
