<template>
  <div class="row justify-center">
    <div style="width: 350px; max-width: 95vw;">
      <div v-if="store.user">
        <q-item dense>
          <h5> {{ store.user.name }} </h5>
        </q-item>
        <q-item dense>
          <q-btn @click="$router.push('kodol')" push color="primary">Kódolás</q-btn>
          <q-btn @click="store.user=null;scanUser=true; store.userError=''" push color="negative">Kijelentkezés</q-btn>
        </q-item>
        <q-item>
          <h5>Táblázatok </h5>
        </q-item>
        <q-item separator v-for="view in userviews" :key="view.id" :to="'/table/'+view.id">
          {{view.label}}
        </q-item>
      </div>
      <div v-else>
        <h5> Jelentkezzen be kártyájával! </h5>
        <q-input v-if="scanUser && !store.user" type="number" v-model="qrcode" @keyup.enter="gotUserQR(qrcode)"></q-input>
        <qrcode-reader v-show="scanUser" :video-constraints="store.video" @decode="gotUserQR"> </qrcode-reader>
        <h5 class="text-negative"> {{ store.userError }} </h5>
      </div>
    </div>
  </div>
</template>

<script>

import Config from '../config'
import Store from '../store'
import { RpcRaw } from '../rpc'

import {
  QInput,
  QBtn,
  QItem
} from 'quasar'

export default {
  name: 'home',
  components: {
    QInput,
    QBtn,
    QItem
  },
  data () {
    return {
      config: Config,
      store: Store,
      scanUser: true,
      qrcode: null
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
          this.scanUser = false
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
          this.store.kodolasok = []
          this.store.menthet = true
          this.scanUser = false
        }
        else {
          this.store.userError = 'Érvénytelen felhasználó kód!'
        }
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.q-btn
  margin-right 1em
.row
  font-size 1.2rem
.q-item
  font-size 1.2rem
</style>
