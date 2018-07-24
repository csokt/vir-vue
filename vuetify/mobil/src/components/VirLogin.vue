<template>
  <v-flex xs12 sm8 md5>
    <v-card class="elevation-12">
      <v-card-title> <div class="title grey--text">VIR</div> </v-card-title>
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
    </v-card>
  </v-flex>
</template>

<script>
import { API } from '@/backend/rest.js'
import { EventBus, getVirUser } from '@/util.js'
import Store from '@/store'

export default {
  name: 'virLogin',
  props: {
    msg: String
  },

  components: {
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
      // const response = await API.post('vir/login', {username: this.username, password: this.password})
      const response = await API.post('vir/login', {username: 'hegedus.istvan', password: 'Godhak04'})
      if (response.ok) {
        getVirUser(this)
      } else {
        EventBus.$emit('inform', {type: 'alert', variation: 'warning', message: response.problem})
      }
    }
  }
}
</script>
