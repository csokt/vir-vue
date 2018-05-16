<template>
  <v-container fluid fill-height grid-list-lg>
    <v-layout  justify-center wrap>
      <template v-if="store.fireUser">

        <v-flex xs12 sm8 md5>
          <v-card class="elevation-12">
            <v-card-title> <div class="title grey--text">Hitelesítés</div> </v-card-title>
            <v-card-text>
              <v-form ref="logoutForm">
                <v-text-field
                  v-model="store.fireUser.email"
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

        <v-flex xs12 sm8 md5>
          <v-card class="elevation-12">
            <v-card-title> <div class="title grey--text">Képernyőzár PIN kód</div> </v-card-title>
            <v-card-text>
              <v-form ref="pinForm" v-model="pinFormValid" lazy-validation>
                <v-text-field
                  v-model="pin"
                  type="number"
                  :rules="pinRules"
                  prepend-icon="security"
                  label="PIN kód"
                  required
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="">Megadás</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>

        <v-flex xs12 sm8 md5>
          <v-card class="elevation-12">
            <v-card-title> <div class="title grey--text">TIR belépés</div> </v-card-title>
            <v-card-text>
              <v-form ref="tirForm" v-model="tirFormValid" lazy-validation>
                <v-text-field
                  v-model="tir"
                  type="number"
                  :rules="tirRules"
                  prepend-icon="border_clear"
                  label="TIR kód"
                  required
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="">Megadás</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>

        <v-flex xs12 sm8 md5>
          <v-card class="elevation-12">
            <v-card-title> <div class="title grey--text">VIR belépés</div> </v-card-title>
            <v-card-text>
              <v-form ref="virForm" v-model="virFormValid" lazy-validation>
                <v-text-field
                  v-model="virname"
                  :rules="virnameRules"
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
              <v-btn color="primary" @click="">Bejelentkezés</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>

      </template>

      <template v-if="!store.fireUser">
        <v-flex xs12 sm8 md5>
          <v-card class="elevation-12">
            <v-card-title> <div class="title grey--text">Hitelesítés</div> </v-card-title>
            <v-card-text>
              <v-form ref="loginForm" v-model="loginFormValid" lazy-validation>
                <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  prepend-icon="person"
                  label="E-mail"
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
              <v-btn color="primary" :disabled="!loginFormValid" @click="submit">Bejelentkezés</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </template>

    </v-layout>
  </v-container>
</template>

<script>
// import Vue from 'vue'
// import axios from 'axios'
// import VueQrcodeReader from 'vue-qrcode-reader'
// Vue.use(VueQrcodeReader)

import Store from '../store'
// import firebase from 'firebase/app'
// import 'firebase/auth'
import { signIn, signOut } from '../firebase'

export default {
  name: 'home',

  data: () => ({
    store: Store,
    loginFormValid: false,
    pinFormValid: false,
    tirFormValid: false,
    email: '@szefo.local',
    emailRules: [
      v => !!v || 'E-mail megadása kötelező',
      // v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail formátum helytelen'
      v => /^\w+([.-]?\w+)*@szefo.local$/.test(v) || 'Helytelen e-mail formátum'
    ],
    virname: '',
    virnameRules: [
      v => !!v || 'Név megadása kötelező',
      v => /^\w+([.-]?\w+)*$/.test(v) || 'Helytelen név formátum'
    ],
    password: '',
    passwordRules: [
      v => !!v || 'Jelszó megadása kötelező'
    ],
    pin: '',
    pinRules: [
      v => !!v || 'PIN megadása kötelező',
      v => /^\d\d\d\d$/.test(v) || 'Négy számjegy'
    ],
    tir: '',
    tirRules: [
      v => !!v || 'TIR megadása kötelező',
      v => /^\d\d\d\d\d$/.test(v) || 'Öt számjegy'
    ]
  }),

  created () {
    this.store.pageTitle = 'Beállítások'
    // this.store.rootPage = false
  },

  methods: {
    submit () {
      if (this.$refs.loginForm.validate()) {
        signIn(this.email, this.password)
      }
    },

    logout () {
      signOut()
    }
  }
}
</script>
