<template>
  <div>
    <h3>{{ msg }}</h3>
    name: {{store.virUser && store.virUser.name}} <br>
    <button v-on:click="logout">Logout button</button><br>
  </div>
</template>

<script>
import { API } from '@/backend/rest.js'
import { EventBus, getVirUser } from '@/util.js'
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
    async logout () {
      const response = await API.post('vir/logout')
      console.log(response)
      if (response.ok) {
        EventBus.$emit('inform', {type: 'alert', variation: 'notice', message: 'logged out'})
        getVirUser(this)
      } else {
        EventBus.$emit('inform', {type: 'alert', variation: 'warning', message: response.problem})
      }
    }
  }
}
</script>
