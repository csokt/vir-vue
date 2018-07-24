<template>
  <v-flex xs12 sm8 md5>
    <v-card class="elevation-12">
      <v-card-title> <div class="title grey--text">Mobil alkalmazások</div> </v-card-title>
      <v-card-text>
        <v-form @submit.prevent>
          <v-text-field
            v-model="store.user.name"
            prepend-icon="person"
            readonly
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="logout">Kijelentkezés</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
import { API } from '@/backend/rest.js'
import { EventBus, getUser, getVirUser } from '@/util.js'
import Store from '@/store'

export default {
  name: 'loopbackLogout',
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
