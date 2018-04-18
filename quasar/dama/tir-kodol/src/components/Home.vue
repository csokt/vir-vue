<template>
  <div class="row justify-center">
    <div style="width: 400px; max-width: 95vw;">
      <div class="text-faded text-bold text-center text-margin-top">Termelés információs rendszer</div>
      <h5 class="text-negative"> {{message}} </h5>
      <hr>
      <template v-if="store.user">
        <q-item>
          <span class="name">{{ store.user.name }}</span>
        </q-item>
        <q-item>
          <q-btn v-if="store.user.role!='meo'" @click="$router.push('kodol')" push color="primary">Kódolás</q-btn>
          <q-btn @click="logout" push color="negative">Kijelentkezés</q-btn>
        </q-item>
        <q-item>
          <q-btn @click="$router.push('search')" push color="secondary">Dokumentációk</q-btn>
          <q-btn v-if="store.user.role=='varró'" @click="$router.push('norma')" push color="primary">Mai %</q-btn>
        </q-item>
        <q-item>
          <h5>Táblázatok </h5>
        </q-item>
        <q-item separator v-for="view in userviews" :key="view.id" :to="'/table/'+view.id">
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
import Config from '../config'
import Store from '../store'
import { RpcRaw, Log } from '../rpc'

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
      config: Config,
      store: Store,
      scanUser: true,
      qrcode: null,
      message: ''
    }
  },
  computed: {
    userviews: function () {
      if (this.store.user) {
        return this.config.views.filter(view => view.roles.includes(this.store.user.role))
      }
      else {
        return []
      }
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
      if (qr < 50000) {
        const dolgozokod = qr - 20000
        const response = await RpcRaw("select [dolgozokod], [dolgozonev] from [dolgtr] where [aktiv] = 'A' and [dolgozokod] = " + dolgozokod.toString())
        if (response.result && response.result.length) {
          this.store.user = {name: response.result[0].dolgozonev.trim(), role: 'varró', belepokod: response.result[0].dolgozokod + 20000}
          this.store.kodol = {
            telephelykod: 0,
            telephely: 'Szeged, Tavasz u. 2.',
            kodolokod: -1,
            kodolo: 'dolgozó',
            dolgozokod: this.store.user.belepokod,
            dolgozo: this.store.user.name,
            belepokod: this.store.user.belepokod,
            username: this.store.user.name,
            munkalap: null,
            kartoninfo: null,
            gepkod: 0,
            muveletkodok: [],
            mennyiseg: null,
            role: this.store.user.role
          }
          this.store.kodolasok = []
          this.store.menthet = true
          this.scanUser = false
          this.message = ''
          Log('login', this.store.user)
          return
        }
      }
      else if (qr < 51000) {
        const userid = qr - 50000
        const response = await RpcRaw('select [userid], [fullname] from [users] where [userid] = ' + userid.toString())
        if (response.result && response.result.length) {
          this.store.user = {name: response.result[0].fullname.trim(), role: 'kódoló', belepokod: response.result[0].userid + 50000}
          this.store.kodol = {
            telephelykod: 0,
            telephely: 'Szeged, Tavasz u. 2.',
            kodolokod: this.store.user.belepokod,
            kodolo: this.store.user.name,
            dolgozokod: null,
            dolgozo: null,
            belepokod: this.store.user.belepokod,
            username: this.store.user.name,
            munkalap: null,
            kartoninfo: null,
            gepkod: 0,
            muveletkodok: [],
            mennyiseg: null,
            role: this.store.user.role
          }
          this.store.kodolasok = []
          this.store.menthet = true
          this.scanUser = false
          this.message = ''
          Log('login', this.store.user)
          return
        }
      }
      else if (qr < 54000) {}
      else if (qr < 55000) {
        this.store.user = {name: 'MEO', role: 'meo', belepokod: qr, filterUzem: 1, filterMunkalap: '0'}
        this.message = ''
        Log('login', this.store.user)
        return
      }
      this.message = 'Érvénytelen felhasználó kód!'
      Log('message', {message: this.message})
    },
    logout () {
      Log('logout', this.store.user)
      this.store.user = null
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
