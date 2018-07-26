<template>
  <v-flex xs12 sm8 md5>
    <v-card class="elevation-12">
      <v-card-title> <div class="title grey--text">VIR</div> </v-card-title>
      <v-card-text>
        <v-form @submit.prevent>
          <v-text-field
            v-model="store.virUser.name"
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
import { EventBus, getVirUser } from '@/util.js'
import Store from '@/store'

export default {
  name: 'virLogout',
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
        EventBus.$emit('inform', {type: 'alert', variation: 'success', message: 'Kijelentkezett'})
        getVirUser(this)
      } else {
        EventBus.$emit('inform', {type: 'alert', variation: 'error', message: 'Kijelentkezési hiba!'})
      }
    }
  }
}
</script>
