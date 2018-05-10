<template>

  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 md4 offset-sm3 offset-md4>
        <v-card>
          <v-card-text>
            <v-container>

  <v-form ref="loginForm" v-model="valid" lazy-validation>
    <v-text-field
      v-model="name"
      :rules="nameRules"
      :counter="10"
      label="Name"
      required
    ></v-text-field>
    <v-text-field
      v-model="email"
      :rules="emailRules"
      label="E-mail"
      required
    ></v-text-field>
    <v-text-field
      v-model="password"
      :rules="passwordRules"
      label="Jelszó"
      type="password"
      required
    ></v-text-field>

    <v-btn :disabled="!valid" @click="submit">submit</v-btn>
  </v-form>

            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
// import Vue from 'vue'
// import axios from 'axios'
// import VueQrcodeReader from 'vue-qrcode-reader'
// Vue.use(VueQrcodeReader)

import Store from '../store'
import { signIn, signOut } from '../firebase'

export default {
  name: 'login',

  data: () => ({
    store: Store,
    valid: true,
    name: '',
    nameRules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 10) || 'Name must be less than 10 characters'
    ],
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
    ],
    password: '',
    passwordRules: [
      v => !!v || 'Jelszó is required'
    ]
  }),

  methods: {
    signIn: signIn,
    signOut: signOut,
    submit () {
      if (this.$refs.loginForm.validate()) {
        // Native form submission is not yet supported
        console.log('login')
      }
    }
  }
}
</script>
