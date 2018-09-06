<template>
  <div class="row justify-center">
    <div style="width: 400px; max-width: 95vw;">
      <div class="text-faded text-bold text-center text-margin-top">Termelés információs rendszer {{store.version}}</div>
      <h5 class="text-negative"> {{message}} </h5>
      <hr>
      <template v-if="store.user">
        <q-item>
          <span class="name">{{ store.user.name }}, {{ store.user.uzemnev }}</span>
        </q-item>
        <q-item>
          <q-btn v-if="store.user.role!='meo'" @click="$router.push('kodol')" push color="primary">Kódolás</q-btn>
          <q-btn v-if="store.user.role=='kódoló'" @click="$router.push('atad')" push color="primary">Átadás</q-btn>
          <q-btn @click="logout" push color="negative">Kilépés</q-btn>
        </q-item>
        <q-item>
          <q-btn @click="$router.push('info')" push color="secondary">Munkalap információk</q-btn>
        </q-item>
        <q-item>
          <q-btn @click="$router.push('search')" push color="secondary">Dokumentációk</q-btn>
          <q-btn v-if="['varró','varró2'].includes(store.user.role) || store.user.role=='szabó'" @click="$router.push('norma')" push color="primary">Mai %</q-btn>
        </q-item>
        <q-item>
          <h5>Táblázatok </h5>
        </q-item>
        <q-item separator v-for="view in store.views" :key="view.id" :to="'/table/'+view.id">
          {{view.label}}
        </q-item>
      </template>

      <template v-if="!store.user">
        <q-item>
          Jelentkezzen be kártyájával!
        </q-item>
        <q-field v-if="store.teszt" class="full-width" label="Belépési kód" labelWidth=5 >
          <q-input v-if="scanUser && !store.user" type="number" v-model="qrcode" @keyup.enter="gotUserQR(qrcode)"></q-input>
        </q-field>
        <q-item>
          <qrcode-reader v-show="scanUser" :video-constraints="store.video" @decode="gotUserQR"> </qrcode-reader>
        </q-item>
      </template>
    </div>
  </div>
<!--
-->
</template>

<script>
import API from '../rest.js'
import Store from '../store'
import { Log } from '../rpc'

import {
  QField,
  QInput,
  QBtn,
  QItem
} from 'quasar'

export default {
  name: 'home',
  components: {
    QField,
    QInput,
    QBtn,
    QItem
  },

  data () {
    return {
      store: Store,
      scanUser: true,
      qrcode: null,
      message: ''
    }
  },

  methods: {
    async gotUserQR (value) {
      const qr = parseInt(value)
      if (!qr) {
        this.message = 'Csak számot lehet megadni!'
        Log('message', {message: this.message})
        return
      }
      const response = await API.post('tir/belep/' + qr)
      if (response.ok) {
        this.store.user = response.data.user
        this.store.kodol = response.data.kodol
      }
      else {
        this.message = 'Érvénytelen felhasználó kód!'
        Log('message', {message: this.message})
        console.log(response.problem)
      }
    },

    logout () {
      Log('logout', this.store.user)
      this.store.user = null
      this.store.kodol = {}
      this.store.infok = []
      this.scanUser = true
      this.message = ''
    }
  },

  created () {
    Log('navigate')
  }
}
</script>

<style scoped lang="stylus">
.text-margin-top
  margin-top 0.4em
.name
  font-size 1.7rem
.q-btn
  margin-top 0.3em
  margin-right 1em
.row
  font-size 1.2rem
.q-item
  font-size 1.2rem
</style>
