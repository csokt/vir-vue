<template>
  <div class="row justify-center">
    <div style="width: 500px; max-width: 95vw;">

      <div v-if="store.user">
        <h5> Üdvözlöm {{ store.user.name }} </h5>
        <q-btn @click="store.user=null" push color="secondary">Kijelentkezés</q-btn>
        <br>
        <q-btn @click="$router.push('kodol')" push color="secondary">Kódolás</q-btn>
      </div>
      <div v-else>
        <q-btn @click="scanUser=true; store.userError=''" push color="secondary">Jelentkezzen be kódkártyájával!</q-btn>
        <div> {{ store.userError }} </div>
        <q-input v-if="scanUser && !store.user" type="number" v-model="qrcode" @keyup.enter="gotUserQR(qrcode)"></q-input>
        <QrcodeReader v-if="scanUser" @decode="gotUserQR"> </QrcodeReader>
      </div>

      <q-list  separator no-border>
        <q-item>
          <h5>Táblázatok </h5>
        </q-item>
        <q-item v-for="view in userviews" :key="view.id" :to="'/table/'+view.id">
          {{view.label}}
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>

import Config from '../config'
import Store from '../store'
import { RpcRaw } from '../rpc'
import { QrcodeReader } from 'vue-qrcode-reader'

import {
  QInput,
  QBtn,
  QList,
  QItem
} from 'quasar'

export default {
  name: 'home',
  components: {
    QrcodeReader,
    QInput,
    QBtn,
    QList,
    QItem
  },
  data () {
    return {
      config: Config,
      store: Store,
      scanUser: false,
      qrcode: null,
      messageUser: ''
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
        this.store.userError = 'Csak számot lehet megadni!'
        return
      }
      if (qr < 20000) {
        this.store.userError = 'A kód 20000-nél nem lehet kisebb!'
      }
      else if (qr < 50000) {
        const dolgozokod = qr - 20000
        const response = await RpcRaw("select [dolgozokod], [dolgozonev] from [dolgtr] where [aktiv] = 'A' and [dolgozokod] = " + dolgozokod.toString())
        // console.log(response)
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
            muveletkod: null,
            mennyiseg: null,
            role: this.store.user.role
          }
          this.store.kodolasok = []
          this.store.menthet = true
        }
        else {
          this.store.userError = 'Érvénytelen felhasználó kód!'
        }
      }
      else {
        const userid = qr - 50000
        const response = await RpcRaw('select [userid], [fullname] from [users] where [userid] = ' + userid.toString())
        // console.log(response)
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
            muveletkod: null,
            mennyiseg: null,
            role: this.store.user.role
          }
        }
        else {
          this.store.userError = 'Érvénytelen felhasználó kód!'
        }
      }
      this.scanUser = false
    }
  }
}
</script>
