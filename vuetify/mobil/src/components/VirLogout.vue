<template>
  <div>
    <h3>{{ msg }}</h3>
    name: {{store.virUser && store.virUser.name}} <br>
    <button v-on:click="logout">Logout button</button><br>
  </div>
</template>

<script>
import { virLogout } from '@/backend/rest.js'
import Store from '@/store'

export default {
  name: 'virLogout',
  props: {
    msg: String
  },

  components: {
  },

  data () {
    return {
      store: Store
    }
  },

  methods: {
    logout () {
      virLogout()
    }
  }
}
</script>
