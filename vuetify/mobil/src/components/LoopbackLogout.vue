<template>
  <div>
    <h3>{{ msg }}</h3>
    name: {{store.user && store.user.name}} <br>
    <button v-on:click="logout">Logout button</button><br>
  </div>
</template>

<script>
import { API } from '@/backend/rest.js'
import { EventBus, getUser, getVirUser } from '@/util.js'
import Store from '@/store'

export default {
  name: 'loopbackLogout',
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
    async logout () {
      const response = await API.post('Users/logout')
      if (response.ok) {
        EventBus.$emit('inform', {type: 'alert', variation: 'success', message: 'logged out'})
        delete localStorage.szefo_loopback_token
        API.setHeader('Authorization', undefined)
        getUser(this)
        getVirUser(this)
      } else {
        EventBus.$emit('inform', {type: 'alert', variation: 'warning', message: response.problem})
      }
    }
  }
}
</script>
