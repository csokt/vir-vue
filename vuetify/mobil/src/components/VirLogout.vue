<template>
  <BaseCard title="VIR">
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
  </BaseCard>
</template>

<script>
import { API, EventBus, getVirUser } from '@/util.js'
import BaseCard from '@/components/core/BaseCard.vue'
import Store from '@/store'

export default {
  name: 'virLogout',
  components: {
    BaseCard
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
        EventBus.$emit('inform', { type: 'alert', variation: 'success', message: 'Kijelentkezett' })
        getVirUser(this)
      } else {
        EventBus.$emit('inform', { type: 'alert', variation: 'error', message: 'Kijelentkezési hiba!' })
      }
    }
  }
}
</script>
