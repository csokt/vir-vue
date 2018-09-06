<template>
  <div class="row justify-center">
    <div style="width: 550px; max-width: 95vw;">
      <div class="text-faded text-bold text-center text-margin-top">Átadás</div>
      <hr>
      <h5 class="text-negative"> {{message}} </h5>

      <template v-if="store.user">
        <q-field class="full-width" label="Helykód" labelWidth=3 >
          <q-input ref="hely" type="number" v-model="store.kodol.hely" @change="store.kodol.helynev=null;store.kodol.uzemkod = 0;store.kodol.uzemnev = null" @keyup.enter="gotHely(null)" @blur="gotHely(null)"></q-input>
          <qrcode-reader v-if="!store.kodol.hely" :video-constraints="store.video" @decode="gotHely"> </qrcode-reader>
        </q-field>

        <q-field class="full-width" label="Helynév" labelWidth=3>
          <q-input v-model="store.kodol.helynev" readonly></q-input>
        </q-field>

        <q-field v-if="store.kodol.hely == 90026" class="full-width" label="Üzemkód" labelWidth=3 >
          <q-input ref="uzemkod" type="number" v-model="store.kodol.uzemkod" @change="store.kodol.uzemnev=null" @keyup.enter="gotUzemkod(null)" @blur="gotUzemkod(null)"></q-input>
          <qrcode-reader v-if="!store.kodol.uzemkod && store.kodol.helynev" :video-constraints="store.video" @decode="gotUzemkod"> </qrcode-reader>
        </q-field>

        <q-field v-if="store.kodol.hely == 90026" class="full-width" label="Üzemnév" labelWidth=3>
          <q-input v-model="store.kodol.uzemnev" readonly></q-input>
        </q-field>

        <q-field class="full-width" label="Munkalap" labelWidth=3 >
          <q-input ref="munkalap" type="number" v-model="store.kodol.munkalap" @change="store.kodol.kartoninfo=null" @keyup.enter="gotMunkalap(null)" @blur="gotMunkalap(null)"></q-input>
          <qrcode-reader v-if="!store.kodol.munkalap && store.kodol.helynev && (store.kodol.hely == 90026 && store.kodol.uzemnev || store.kodol.hely != 90026)" :video-constraints="store.video" @decode="gotMunkalap"> </qrcode-reader>
        </q-field>

        <q-field class="full-width" label="Kartoninfo" labelWidth=3>
          <q-input v-model="store.kodol.kartoninfo" readonly></q-input>
        </q-field>

        <h5 class="text-negative"> {{message}} </h5>

        <q-btn v-if="store.menthet && store.kodol.helynev && store.kodol.munkalap && store.kodol.kartoninfo && (store.kodol.hely != 90026 || store.kodol.uzemnev)" @click="pubAtadas" push color="positive">Adatok mentése</q-btn>
        <q-btn @click="$router.go(-1)" push color="warning">Vissza</q-btn>
        <q-btn v-if="store.menthet && store.kodol.hely" @click="ujHely" push color="tertiary">Új Hely</q-btn>
        <q-btn v-if="store.menthet && store.kodol.munkalap" @click="ujMunkalap" push color="tertiary">Új munkalap</q-btn>
        <q-btn v-if="store.menthet && store.kodol.kartoninfo" @click="$router.push('search')" push color="secondary">Dokumentációk</q-btn>
        <q-btn v-if="store.menthet && store.kodol.kartoninfo" @click="$router.push('table/cikknormai')" push color="secondary">Konfekció normalapok</q-btn>

      </template>
      <table class="q-table striped cell-separator bordered compact">
        <thead>
          <tr>
            <th>Helykód</th>
            <th>Munkalap</th>
            <th>Eredmény</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in store.atadasok" v-bind:class="{ 'text-negative': row.error }">
            <td>{{row.hely}}</td>
            <td>{{row.munkalap}}</td>
            <td>{{row.eredmeny}}</td>
          </tr>
        </tbody>
      </table>

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
  QChipsInput,
  QBtn
} from 'quasar'

export default {
  name: 'atad',
  components: {
    QField,
    QInput,
    QChipsInput,
    QBtn
  },
  data () {
    return {
      store: Store,
      qrcode: null,
      message: ''
    }
  },
  methods: {
    async gotHely (value) {
      this.message = ''
      try {
        if (value) { this.store.kodol.hely = parseInt(value) }
        if (!this.store.kodol.hely) { return }
        this.store.kodol.hely = parseInt(JSON.stringify(this.store.kodol.hely))
      }
      catch (e) {
        this.message = 'Érvénytelen hely!'
        Log('message', {message: e.message})
        console.log(e)
        return
      }
      const response = await API.get('tir/vonalkodok/' + this.store.kodol.hely)
      if (response.ok) {
        const row = response.data
        this.store.kodol.helynev = row.kodnev
        if (this.store.kodol.hely === 90026) {
          this.$refs.uzemkod.focus()
        }
        else {
          this.$refs.munkalap.focus()
        }
      }
      else {
        this.store.kodol.helynev = null
        this.message = 'Érvénytelen hely!'
        Log('message', {message: this.message})
      }
    },

    async gotUzemkod (value) {
      this.message = ''
      try {
        if (value) { this.store.kodol.uzemkod = parseInt(value) }
        if (!this.store.kodol.uzemkod) { return }
        this.store.kodol.uzemkod = parseInt(JSON.stringify(this.store.kodol.uzemkod))
      }
      catch (e) {
        this.message = 'Érvénytelen üzemkód!'
        Log('message', {message: e.message})
        console.log(e)
        return
      }
      const uzemkod = this.store.kodol.uzemkod - 54000
      const response = await API.get('tir/uzemek/' + uzemkod)
      if (response.ok) {
        const row = response.data
        this.store.kodol.uzemnev = row.uzemnev
        this.$refs.munkalap.focus()
      }
      else {
        this.store.kodol.uzemnev = null
        this.message = 'Érvénytelen uzemkod!'
        Log('message', {message: this.message})
      }
    },

    async gotMunkalap (value) {
      this.message = ''
      try {
        if (value) { this.store.kodol.munkalap = parseInt(value) }
        if (!this.store.kodol.munkalap) { return }
        this.store.kodol.munkalap = parseInt(JSON.stringify(this.store.kodol.munkalap))
      }
      catch (e) {
        this.message = 'Érvénytelen munkalap!'
        Log('message', {message: e.message})
        console.log(e)
        return
      }
      const kellek = Math.floor(this.store.kodol.munkalap / 10000000) === 3
      const munkalap = kellek ? this.store.kodol.munkalap - 10000000 : this.store.kodol.munkalap
      const response = await API.get('tir/munkalapok/' + munkalap)
      if (response.ok) {
        const row = response.data
        if (kellek) {
          this.store.kodol.kartoninfo = row.cikkszam.trim() + '/' + parseInt(row.rendelesszam.trim().slice(-4).toString()) + ' ' + row.mennyiseg.toString() + ' db'
        }
        else {
          this.store.kodol.kartoninfo = row.cikkszam.trim() + '/' + parseInt(row.rendelesszam.trim().slice(-4).toString()) + ' ' + row.kartonszam.trim() + ' ' + row.db.toString() + ' db'
        }
        this.store.user.filterMunkalap = munkalap
        this.store.user.filterCikkszam = row.cikkszam.trim()
      }
      else {
        this.store.kodol.kartoninfo = null
        this.message = 'Érvénytelen munkalap!'
        Log('message', {message: this.message})
      }
    },

    async pubAtadas () {
      Log('atad', this.store.kodol)
      this.message = ''
      this.store.menthet = false
      let doc = Object.assign({}, this.store.kodol)
      doc.funkcio = doc.hely
      doc.createdAt = new Date()
      this.store.atadasok.unshift(doc)
      const response = await API.post('tir/atad', doc)
      if (response.ok) {
        this.store.atadasok[0].eredmeny = response.data.message
        this.store.atadasok[0].error = parseInt(response.data.error)
        if (this.store.atadasok[0].error) {
          this.message = this.store.atadasok[0].eredmeny
        }
      }
      else {
        this.message = 'Kódoló szerver hiba, értesítse a rendszergazdát!'
        this.store.atadasok[0].eredmeny = 'Kódoló szerver hiba!'
        this.store.atadasok[0].error = 1
        Log('message', {message: this.message})
        console.log(response.problem)
      }
      if (!this.message) {
        this.store.kodol.munkalap = null
        this.store.kodol.kartoninfo = null
      }
      this.store.menthet = true
    },

    ujHely () {
      Log('clickbutton', {button: 'Új hely'})
      this.store.kodol.hely = null
      this.store.kodol.helynev = null
      this.store.kodol.uzemkod = 0
      this.store.kodol.uzemnev = null
      this.store.kodol.munkalap = null
      this.store.kodol.kartoninfo = null
    },

    ujMunkalap () {
      Log('clickbutton', {button: 'Új munkalap'})
      this.store.kodol.munkalap = null
      this.store.kodol.kartoninfo = null
    }
  },
  created () {
    if (!this.store.user) { this.$router.replace('/'); return }
    this.store.kodol.dolgozokod = 0
    this.store.kodol.dolgozo = null
    this.store.kodol.mennyiseg = 0
    Log('navigate')
  }
}
</script>

<style scoped lang="stylus">
.text-margin-top
  margin-top 0.4em
.q-btn
  margin-top 0.5em
  margin-bottom 0.5em
  margin-right 0.7em
.row
  font-size 1.2rem
.q-field
  margin-top 8px
.q-table
  margin-top 0.5em
</style>
