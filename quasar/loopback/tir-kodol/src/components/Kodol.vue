<template>
  <div class="row justify-center">
    <div style="width: 550px; max-width: 95vw;">
      <div class="text-faded text-bold text-center text-margin-top">Teljesítmény kódolás</div>
      <hr>
      <h5 class="text-negative"> {{message}} </h5>

      <template v-if="store.user">
        <q-field class="full-width" label="Dolgozó" labelWidth=3>
          <q-input v-if="store.kodol.dolgozo" v-model="store.kodol.dolgozo" readonly></q-input>
          <q-input v-if="!store.kodol.dolgozo" type="number" v-model="qrcode" @keyup.enter="gotDolgozoQR(qrcode)"></q-input>
          <qrcode-reader v-if="!store.kodol.dolgozo" :video-constraints="store.video" @decode="gotDolgozoQR"> </qrcode-reader>
        </q-field>

        <template v-if="store.kodol.dolgozo">
          <q-field class="full-width" label="Munkalap" labelWidth=3 >
            <q-input ref="munkalap" type="number" v-model="store.kodol.munkalap" @change="store.kodol.kartoninfo=null" @keyup.enter="gotMunkalap(null)" @blur="gotMunkalap(null)"></q-input>
            <qrcode-reader v-if="!store.kodol.munkalap" :video-constraints="store.video" @decode="gotMunkalap"> </qrcode-reader>
          </q-field>

          <q-field class="full-width" label="Kartoninfo" labelWidth=3>
            <q-input v-model="store.kodol.kartoninfo" readonly></q-input>
          </q-field>

          <q-field class="full-width" label="Gépkód" labelWidth=3 >
            <q-input ref="gepkod" type="number" v-model="store.kodol.gepkod" @keyup.enter="$refs.muveletkodok.focus()"></q-input>
            <qrcode-reader v-if="store.kodol.gepkod === null || store.kodol.gepkod === ''" :video-constraints="store.video" @decode="gotGepkodQR"> </qrcode-reader>
          </q-field>

          <q-field class="full-width" label="Műveletkódok" labelWidth=3 >
            <q-chips-input ref="muveletkodok" id="muveletkodok_id" v-model="store.kodol.muveletkodok" @keyup.enter="$refs.mennyiseg.focus()"/>
          </q-field>

          <q-field class="full-width" label="Mennyiség" labelWidth=3 >
            <q-input ref="mennyiseg" type="number" v-model="store.kodol.mennyiseg" />
          </q-field>
        </template>

        <h5 class="text-negative"> {{message}} </h5>

        <q-btn v-if="store.menthet && store.kodol.munkalap && store.kodol.kartoninfo && store.kodol.muveletkodok.length && store.kodol.mennyiseg" @click="pubKodolas" push color="positive">Adatok mentése</q-btn>
        <q-btn @click="$router.go(-1)" push color="warning">Vissza</q-btn>
        <q-btn v-if="['varró','varró2'].includes(store.user.role)" @click="$router.push('norma')" push color="secondary">Mai %</q-btn>
        <q-btn v-if="store.menthet && store.kodol.munkalap" @click="ujMunkalap" push color="tertiary">Új munkalap</q-btn>
        <q-btn v-if="store.menthet && store.kodol.dolgozo && store.user.role==='kódoló'" @click="ujDolgozo" push color="tertiary">Új dolgozó</q-btn>
        <q-btn v-if="store.menthet && store.kodol.kartoninfo && !store.kodol.mennyiseg" @click="$router.push('search')" push color="secondary">Dokumentációk</q-btn>
        <q-btn v-if="store.menthet && store.kodol.kartoninfo && !store.kodol.mennyiseg" @click="$router.push('table/cikknormai')" push color="secondary">Konfekció normalapok</q-btn>

      </template>
      <table class="q-table striped cell-separator bordered compact">
        <thead>
          <tr>
            <th>Műv.kód</th>
            <th>Menny.</th>
            <th>Eredmény</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in store.kodolasok" v-bind:class="{ 'text-negative': row.error }">
            <td>{{row.muveletkod}}</td>
            <td>{{row.mennyiseg}}</td>
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
  name: 'kodol',
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
    async gotDolgozoQR (value) {
      const qr = parseInt(value)
      if (!qr) {
        this.message = 'Csak számot lehet megadni!'
        Log('message', {message: this.message})
        return
      }
      this.message = ''
      if (qr < 20000) {
        this.message = 'A kód 20000-nél nem lehet kisebb!'
        Log('message', {message: this.message})
      }
      else {
        this.store.kodol.dolgozokod = value
        const dolgozokod = qr - 20000
        const response = await API.get('tir/dolgozok/' + dolgozokod)
        if (response.ok) {
          this.store.kodol.dolgozo = response.data.dolgozonev
          this.$nextTick(function () {
            document.querySelector('#muveletkodok_id input').setAttribute('type', 'number')
            this.$refs.munkalap.focus()
          })
        }
        else {
          this.message = 'Érvénytelen dolgozó kód!'
          Log('message', {message: this.message})
        }
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
        this.$refs.muveletkodok.focus()
      }
      else {
        this.store.kodol.kartoninfo = null
        this.message = 'Érvénytelen munkalap!'
        Log('message', {message: this.message})
      }
    },

    gotGepkodQR (value) {
      this.store.kodol.gepkod = value
      this.$refs.muveletkodok.focus()
    },

    async pubKodolas () {
      try {
        if (this.store.kodol.gepkod !== parseInt(this.store.kodol.gepkod) || this.store.kodol.gepkod < 0) {
          throw new TypeError('Érvénytelen gépkód!')
        }
      }
      catch (e) {
        this.message = 'Érvénytelen gépkód!'
        Log('message', {message: e.message})
        console.log(e)
        return
      }
      for (let i = 0; i < this.store.kodol.muveletkodok.length; i++) {
        try {
          const kod = this.store.kodol.muveletkodok[i]
          if (Math.ceil(parseFloat(kod)) !== parseInt(kod) || parseInt(kod) <= 0) {
            throw new TypeError('Érvénytelen műveletkód!')
          }
        }
        catch (e) {
          this.message = 'Érvénytelen műveletkód!'
          Log('message', {message: e.message})
          console.log(e)
          return
        }
      }
      try {
        if (this.store.kodol.mennyiseg !== parseInt(this.store.kodol.mennyiseg) || this.store.kodol.mennyiseg <= 0) {
          throw new TypeError('Érvénytelen mennyiség!')
        }
      }
      catch (e) {
        this.message = 'Érvénytelen mennyiség!'
        Log('message', {message: e.message})
        console.log(e)
        return
      }

      this.store.kodol.gepkod = this.store.kodol.gepkod || 0
      Log('kodol', this.store.kodol)
      this.message = ''
      this.store.menthet = false
      for (let i = 0; i < this.store.kodol.muveletkodok.length; i++) {
        this.store.kodol.muveletkod = this.store.kodol.muveletkodok[i]
        let doc = Object.assign({}, this.store.kodol)
        doc.funkcio = 99994
        doc.createdAt = new Date()
        this.store.kodolasok.unshift(doc)
        const response = await API.post('tir/kodol', doc)
        if (response.ok) {
          this.store.kodolasok[0].eredmeny = response.data.message
          this.store.kodolasok[0].error = parseInt(response.data.error)
          if (this.store.kodolasok[0].error) {
            this.message = 'Nem minden tételt sikerült bekódolni!'
          }
        }
        else {
          this.message = 'Kódoló szerver hiba, értesítse a rendszergazdát!'
          this.store.kodolasok[0].eredmeny = 'Kódoló szerver hiba!'
          this.store.kodolasok[0].error = 1
          Log('message', {message: this.message})
          console.log(response.problem)
          break
        }
      }
      if (!this.message) {
        if (this.store.user.role !== 'szabó') {
          this.store.kodol.muveletkodok = []
        }
        this.store.kodol.mennyiseg = null
      }
      this.store.menthet = true
    },

    ujMunkalap () {
      Log('clickbutton', {button: 'Új munkalap'})
      this.store.kodol.munkalap = null
      this.store.kodol.kartoninfo = null
      this.store.kodol.gepkod = 0
      if (this.store.user.role !== 'szabó') {
        this.store.kodol.muveletkodok = []
      }
      this.store.kodol.mennyiseg = null
    },

    ujDolgozo () {
      Log('clickbutton', {button: 'Új dolgozó'})
      this.store.kodol.dolgozokod = null
      this.store.kodol.dolgozo = null
      this.store.kodol.munkalap = null
      this.store.kodol.kartoninfo = null
      this.store.kodol.gepkod = 0
      this.store.kodol.muveletkodok = []
      this.store.kodol.mennyiseg = null
    }
  },
  created () {
    if (!this.store.user) { this.$router.replace('/'); return }
    this.store.kodol.hely = 0
    this.store.kodol.helynev = null
    Log('navigate')
  },
  mounted () {
    this.$nextTick(function () {
      document.querySelector('#muveletkodok_id input').setAttribute('type', 'number')
    })
  }
}
</script>

#muveletkodok_id > div > div > input

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
