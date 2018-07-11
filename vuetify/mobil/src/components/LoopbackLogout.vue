<template>
  <div>
    <h3> Logout component</h3>
    name: {{store.user && store.user.name}} <br>
    <button v-on:click="logout">Logout button</button><br>
  </div>
</template>

<script>
import { logout } from '@/backend/rest.js'
import Store from '@/store'

export default {
  name: 'loopbackLogout',
  components: {
  },

  data () {
    return {
      store: Store
    }
  },

  methods: {
    logout () {
      logout()
    }

  }
}
</script>
