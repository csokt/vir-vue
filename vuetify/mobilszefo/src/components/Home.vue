<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <div v-if="store.fireUser">
          {{ store.fireUser.email }}
        </div>
        <div v-else>
          Még nem hitelesítette magát.
        </div>

  <section class="section">
    <h1 class="title has-text-centered">Sign-in</h1>
    <div class="columns">
      <div class="column is-one-third">

        <div class="card">
          <div class="card-content">
            <form v-on:submit.prevent>
              <div class="field">
                <label class="label">Email</label>
                <div class="control">
                  <input class="input" type="email" placeholder="joe@bloggs.com" v-model="email">
                </div>
              </div>
              <div class="field">
                <label class="label">Password</label>
                <div class="control">
                  <input class="input" type="password" v-model="password">
                </div>
              </div>
              <button type="submit" class="button is-primary" v-on:click="signIn">Sign-in</button>
              <button class="button is-primary" v-on:click="signOut">Sign-out</button>
            </form>
          </div>
        </div>

      </div>
    </div>
  </section>

      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
// import Vue from 'vue'
// import axios from 'axios'
// import VueQrcodeReader from 'vue-qrcode-reader'
// Vue.use(VueQrcodeReader)

import firebase from 'firebase/app'
import 'firebase/auth'
import Store from '../store'

export default {
  name: 'home',
  data () {
    return {
      store: Store,
      email: '',
      password: ''
    }
  },
  methods: {
    signIn: function () {
      firebase.auth()
        .signInWithEmailAndPassword(this.email, this.password)
//        .signInWithEmailAndPassword('fekete.alicja@szefo.local', 'fekete.alicja')
        .then(
          user => {
            console.log(user)
          },
          error => {
            alert(error.message)
          }
        )
    },
    signOut: function () {
      firebase.auth()
        .signOut()
        .then(
          () => {
            console.log('Kilépett')
          },
          error => {
            alert(error.message)
          }
        )
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
