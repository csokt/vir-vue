<template>
  <BaseCard title="VIR">
    <v-card-text>
      <v-form v-model="valid" lazy-validation>
        <v-text-field
          v-model="username"
          :rules="usernameRules"
          prepend-icon="person"
          label="Név"
          required
        ></v-text-field>
        <v-text-field
          v-model="password"
          :rules="passwordRules"
          label="Jelszó"
          type="password"
          prepend-icon="lock"
          required
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" :disabled="!valid" @click="login">Bejelentkezés</v-btn>
    </v-card-actions>
  </BaseCard>
</template>

<script>
import { API, EventBus, getVirUser } from '@/util.js'
import BaseCard from '@/components/core/BaseCard.vue'
import Store from '@/store'

export default {
  name: 'virLogin',
  components: {
    BaseCard
  },

  data: () => ({
    store: Store,
    valid: false,
    username: '',
    usernameRules: [
      v => !!v || 'Név megadása kötelező'
    ],
    password: '',
    passwordRules: [
      v => !!v || 'Jelszó megadása kötelező'
    ]
  }),

  methods: {
    async login () {
      const response = await API.post('vir/login', { username: this.username, password: this.password })
      if (response.ok) {
        getVirUser(this)
      } else {
        EventBus.$emit('inform', { type: 'alert', variation: 'error', message: 'Bejelentkezési hiba!' })
      }
    }
  }
}
</script>
