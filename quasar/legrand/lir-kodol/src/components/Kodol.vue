<template>
  <div class="row justify-center">
    <div style="width: 550px; max-width: 95vw;">
      <div class="text-faded text-bold text-center">Legrand művelet kódolás</div>
      <hr>
      <h5 class="text-negative"> {{message}} </h5>

      <template v-if="store.user">
        <q-field class="full-width" label="Dolgozó" labelWidth=3>
          <q-input v-if="store.dolgozo" v-model="store.dolgozo.name" readonly></q-input>
          <qrcode-reader v-if="!store.dolgozo" :video-constraints="store.video" @decode="checkDolgozo"> </qrcode-reader>
        </q-field>

        <q-field class="full-width" label="Gyártási lap" labelWidth=3>
          <q-input ref="gyartasi_lap" v-on:change="checkGyartasiLap" type="number" v-model="store.gyartasi_lap_id" clearable=true @keyup.enter="$refs.muveletkod.focus()"></q-input>
          <q-input v-if="store.gyartasi_lap" v-model="store.gyartasi_lap.name" readonly></q-input>
        </q-field>

        <q-field class="full-width" label="Műveletkód" labelWidth=3>
          <q-input ref="muveletkod" v-on:change="checkMuvelet" type="number" v-model="store.muveletszam" clearable=true @keyup.enter="$refs.mennyiseg.focus()"></q-input>
          <q-input v-if="store.gylap_szefo_muvelet" v-model="store.gylap_szefo_muvelet.name" readonly></q-input>
        </q-field>

        <q-field class="full-width" label="Hiány" labelWidth=3>
          <q-input v-if="store.gylap_szefo_muvelet" v-model="store.gylap_szefo_muvelet.hiany_db" readonly></q-input>
<!--
          <div v-if="store.gylap_szefo_muvelet">
            {{store.gylap_szefo_muvelet.osszes_db - store.gylap_szefo_muvelet.kesz_db}}
          </div>
-->
        </q-field>

        <q-field class="full-width" label="Mennyiség" labelWidth=3>
          <q-input ref="mennyiseg" type="number" v-model="store.mennyiseg" clearable=true></q-input>
        </q-field>

        <q-btn v-if="store.gyartasi_lap && store.gylap_szefo_muvelet && store.mennyiseg" @click="createMuveletvegzes" push color="positive">Mentés</q-btn>
        <q-btn v-if="store.dolgozo" @click="store.dolgozo = null" push color="tertiary">Új dolgozó</q-btn>
      </template>
      <q-btn @click="$router.go(-1)" push color="warning">Vissza</q-btn>

      <table class="q-table striped cell-separator bordered compact">
        <thead>
          <tr>
            <th>Művelet</th>
            <th>Dolgozó</th>
            <th class="text-right">db</th>
            <th>Létrehozás</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in muveletvegzes">
            <td>{{row.szefo_muvelet_id[1]}}</td>
            <td>{{row.szemely_id[1]}}</td>
            <td class="text-right">{{row.mennyiseg}}</td>
            <td>{{utc2local(row.create_date)}}</td>
          </tr>
        </tbody>
      </table>

    </div>
  </div>
<!--
-->
</template>

<script>
import odoo from '../odoo-jsonrpc'
import Store from '../store'
import {
  QField,
  QInput,
  QBtn
} from 'quasar'

export default {
  name: 'kodol',
  components: {
    QField,
    QInput,
    QBtn
  },
  data () {
    return {
      store: Store,
      qrcode: null,
      muveletvegzes: [],
      message: ''
    }
  },
  methods: {
    utc2local (utc) {
      return new Date(utc + 'Z').toLocaleString().replace(' ', '').replace(' ', '')
    },

    async createMuveletvegzes () {
      try {
        this.message = null
        const row = {
          szefo_muvelet_id: this.store.gylap_szefo_muvelet.id,
          hely_id: this.store.user.hely_id[0],
          szemely_id: this.store.dolgozo.id,
          mennyiseg: this.store.mennyiseg,
          megjegyzes: 'lir',
          nexon_azon: this.store.dolgozo.SzemelyId,
          felvette_id: this.store.user.user_id[0]
        }
        await odoo.model.create('legrand.muveletvegzes', row)
        this.selectMuveletvegzes()
        this.store.muveletszam = null
        this.store.gylap_szefo_muvelet = null
        this.store.mennyiseg = null
        this.$refs.muveletkod.focus()
      }
      catch (e) {
        this.message = e.message
        console.log(e)
      }
    },

    async selectMuveletvegzes () {
      try {
        // let result = await odoo.model.searchRead('legrand.muveletvegzes', [['create_uid', '=', store.user.user_id[0]]], [], 5)
        let result = await odoo.model.searchRead('legrand.muveletvegzes', [['felvette_id', '=', this.store.user.user_id[0]]], [], 5)
        this.muveletvegzes = result.records
      }
      catch (e) {
        this.message = e.message
        console.log(e)
      }
    },

    async checkDolgozo (value) {
      this.message = null
      this.store.gyartasi_lap_id = null
      this.store.gyartasi_lap = null
      this.store.muveletszam = null
      this.store.gylap_szefo_muvelet = null
      this.store.mennyiseg = null
      try {
        let result = await odoo.model.searchRead('nexon.szemely', [['SzemelyId', '=', parseInt(value)]])
        if (result.length) {
          this.store.dolgozo = result.records[0]
          this.$refs.gyartasi_lap.focus()
        }
        else {
          this.message = 'Érvénytelen dolgozó kód!'
        }
      }
      catch (e) {
        this.message = e.message
        console.log(e)
      }
    },

    async checkGyartasiLap () {
      this.message = null
      this.store.gyartasi_lap = null
      this.store.muveletszam = null
      this.store.gylap_szefo_muvelet = null
      this.store.mennyiseg = null
      if (this.store.gyartasi_lap_id) {
        try {
          let result = await odoo.model.find('legrand.gyartasi_lap', this.store.gyartasi_lap_id)
          if (result) {
            this.store.gyartasi_lap = result
          }
          else {
            // this.message = 'Érvénytelen gyártási lap!'
          }
        }
        catch (e) {
          this.message = e.message
          console.log(e)
        }
      }
    },

    async checkMuvelet () {
      this.message = null
      this.store.gylap_szefo_muvelet = null
      this.store.mennyiseg = null
      if (this.store.muveletszam) {
        try {
          let result = await odoo.model.searchRead('legrand.gylap_szefo_muvelet', [['gyartasi_lap_id', '=', this.store.gyartasi_lap.id], ['muveletszam', '=', this.store.muveletszam]])
          if (result.length) {
            this.store.gylap_szefo_muvelet = result.records[0]
          }
          else {
            // this.message = 'Érvénytelen művelet!'
          }
        }
        catch (e) {
          this.message = e.message
          console.log(e)
        }
      }
    }
  },

  created () {
    if (this.store.user) {
      this.selectMuveletvegzes()
    }
    else {
      this.$router.replace('/')
    }
  }
}
</script>

<style scoped lang="stylus">
hr
  margin 0.1em
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
  font-size 0.85rem
</style>
