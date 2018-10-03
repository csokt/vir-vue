<template>
  <Card title="Mobil alkalmazások">
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
  </Card>
</template>

<script>
import { API, EventBus, getUser, getVirUser } from '@/util.js'
import Card from '@/components/base/Card.vue'
import Store from '@/store'

export default {
  name: 'loopbackLogout',
  components: {
    Card
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
        EventBus.$emit('inform', { type: 'alert', variation: 'success', message: 'Kijelentkezett' })
        delete localStorage.szefo_loopback_token
        API.setHeader('Authorization', undefined)
        getUser(this)
        getVirUser(this)
      } else {
        EventBus.$emit('inform', { type: 'alert', variation: 'error', message: 'Kijelentkezési hiba!' })
      }
    }
  }
}
</script>
