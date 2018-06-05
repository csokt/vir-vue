<template>
  <div class="row justify-center">
    <div style="width: 550px; max-width: 95vw;">
      <div class="text-faded text-bold text-center text-margin-top">Gyártási információk</div>
      <hr>
      <h5 class="text-negative"> {{message}} </h5>

      <q-field class="full-width" label="Munkalap" labelWidth=3 >
        <q-input ref="munkalap" type="number" v-model="store.kodol.munkalap" @change="store.kodol.kartoninfo=null; infok=[]" @keyup.enter="gotMunkalap(null)" @blur="gotMunkalap(null)"></q-input>
        <qrcode-reader v-if="!store.kodol.munkalap" :video-constraints="store.video" @decode="gotMunkalap"> </qrcode-reader>
      </q-field>

      <q-field class="full-width" label="Kartoninfo" labelWidth=3>
        <q-input v-model="store.kodol.kartoninfo" readonly></q-input>
      </q-field>

        <h5 class="text-negative"> {{message}} </h5>

        <q-btn @click="$router.go(-1)" push color="warning">Vissza</q-btn>
        <q-btn v-if="store.kodol.munkalap" @click="ujMunkalap" push color="tertiary">Új munkalap</q-btn>
        <q-btn @click="$router.push('search')" push color="secondary">Dokumentációk</q-btn>
        <q-btn v-if="store.kodol.kartoninfo" @click="$router.push('table/cikknormai')" push color="secondary">Konfekció normalapok</q-btn>
        <q-btn v-if="store.kodol.kartoninfo" @click="$router.push('table/kodolasok')" push color="secondary">Kódolások a munkalapon</q-btn>

      <table class="q-table striped cell-separator bordered">
        <tbody>
          <tr v-for="row in infok">
            <td>{{row[0]}}</td>
            <td>{{row[1]}}</td>
          </tr>
        </tbody>
      </table>

    </div>
  </div>
<!--
-->
</template>

<script>
import Store from '../store'
import { RpcRaw, Log } from '../rpc'
import {
  QField,
  QInput,
  QChipsInput,
  QBtn
} from 'quasar'

export default {
  name: 'info',
  components: {
    QField,
    QInput,
    QChipsInput,
    QBtn
  },
  data () {
    return {
      store: Store,
      infok: [],
      qrcode: null,
      message: ''
    }
  },
  methods: {
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
      const response = await RpcRaw(`select t1.cikkszam, t1.rendelesszam, t1.kartonszam, t1.db, t1.partnerrendelesszam, t1.itszam, t1.szinkod, t1.meret, t1.megjegyzes,
          t2.mennyiseg, t2.partnercikk, t2.cikkmegnevezes, t2.csoport4, t2.mosott, t3.alapanyag, t3.ugyfelnev
        from rendelesmunkalap t1 join rendelesfej t2 on t1.rendelesszam = t2.rendelesszam join cikktorzs t3 on t1.cikkszam = t3.tcikkszam and t3.aktiv = 'A'
        where munkalapazonosito = ` + munkalap.toString())
      if (response.result && response.result.length) {
        const row = response.result[0]
        this.infok = [
          ['IT azonosító', row.itszam],
          ['Cikkszám', row.cikkszam],
          ['Cikknév', row.cikkmegnevezes],
          ['Gyártási kartonszám', row.kartonszam],
          ['Gépfinomság', row.csoport4 + 'gg'],
          ['Fonal összetétel', row.alapanyag],
          ['Megjegyzés', row.megjegyzes],
          ['Mosott', row.mosott === 'I' ? 'igen' : 'nem'],
          ['Színszám', row.szinkod],
          ['Nagyság', row.meret],
          ['Darabszám', row.db],
          ['Partner', row.ugyfelnev],
          ['Partner rendelésszám', row.partnerrendelesszam],
          ['Partner modellszám', row.partnercikk]
        ]
        if (kellek) {
          this.store.kodol.kartoninfo = row.cikkszam.trim() + '/' + parseInt(row.rendelesszam.trim().slice(-4).toString()) + ' ' + row.mennyiseg.toString() + ' db'
        }
        else {
          this.store.kodol.kartoninfo = row.cikkszam.trim() + '/' + parseInt(row.rendelesszam.trim().slice(-4).toString()) + ' ' + row.kartonszam.trim() + ' ' + row.db.toString() + ' db'
        }
        this.store.user.filterMunkalap = munkalap
        this.store.user.filterCikkszam = row.cikkszam.trim()
        Log('info', this.store.kodol)
        // this.$refs.muveletkodok.focus()
      }
      else {
        this.store.kodol.kartoninfo = null
        this.message = 'Érvénytelen munkalap!'
        Log('message', {message: this.message})
      }
    },

    ujMunkalap () {
      this.store.kodol.munkalap = null
      this.store.kodol.kartoninfo = null
      this.infok = []
    }
  },
  created () {
    if (!this.store.user) { this.$router.replace('/'); return }
    this.gotMunkalap()
    Log('navigate')
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
