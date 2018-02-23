<template>
  <div class="row justify-center">
    <div style="width: 550px; max-width: 95vw;">
      <div class="text-faded text-bold text-center text-margin-top">Chance készlet információk</div>
      <hr>
      <div v-show="odooConnected">
        <q-input ref="hely" placeholder="Hely" v-on:change="checkHely" v-model="helynev" clearable=true @keyup.enter="$refs.cikkszam.focus()">
          <q-autocomplete
            @search="searchHely"
            :debounce="500"
          />
        </q-input>

        <div class="flex-container">
          <q-input ref="cikkszam" placeholder="Cikkszám" v-on:change="checkCikkszam" type="number" v-model="cikkszam" clearable=true></q-input>
          <span class="min-space"></span>
          <q-input prefix="Osztály: " v-on:change="checkOsztaly" v-model="osztaly" upper-case></q-input>
        </div>

        <q-input placeholder="Megnevezés" v-model="cikk.megnevezes" readonly></q-input>

        <div v-if="keszlet.length" class="full-width" label="Készlet" labelWidth=3>
          <table class="q-table striped cell-separator bordered">
            <thead>
              <tr>
                <th>Méret</th>
                <th>Szín</th>
                <th>Előrejelzés</th>
                <th>Raktáron</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in keszlet">
                <td>{{row.meret}}</td>
                <td>{{row.szin}}</td>
                <td class="text-right">{{row.varhato}}</td>
                <td class="text-right">{{row.raktaron}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <h5 class="text-negative"> {{message}} </h5>
    </div>
  </div>
</template>

<script>
import odoo from '../odoo-jsonrpc'
import {
  QItem,
  QField,
  QInput,
  QAutocomplete
} from 'quasar'

function parseHelyek (helyek) {
  return helyek.map(hely => {
    return {
      label: hely.name,
      value: hely.name
    }
  })
}

export default {
  name: 'app',
  components: {
    QItem,
    QField,
    QInput,
    QAutocomplete
  },
  data () {
    return {
      upper: '',
      helynev: '',
      cikkszam: '',
      osztaly: '1',
      hely: {},
      cikk: {},
      keszlet: [],
      odooConnected: false,
      message: ''
    }
  },

  created: async function () {
    try {
      this.odooConnected = false
      this.message = 'Kapcsolódás az adatbázishoz ...'
      odoo.setHost('.')
      await odoo.login('szefo', 'frontend', 'Szefo1953')
      this.odooConnected = true
      this.message = ''
    }
    catch (e) {
      this.message = 'Nincs kapcsolat az adatbázissal!'
      console.log(e)
    }
  },

  methods: {
    async searchHely (terms, done) {
      try {
        let result = await odoo.model.searchRead('chance.hely', [['name', 'ilike', terms]], ['id', 'azonosito', 'name'], 8)
        done(parseHelyek(result.records))
      }
      catch (e) {
        this.message = e.message
        console.log(e)
      }
    },

    async readKeszlet () {
      try {
        let result = await odoo.model.searchRead('chance.keszlet', [['hely_id', '=', this.hely.id], ['cikk_id.cikkszam', '=', this.cikkszam], ['osztaly', '=', this.osztaly], ['szefo_e', '=', true]])
        this.keszlet = result.records
      }
      catch (e) {
        this.message = e.message
        console.log(e)
      }
    },

    async checkHely (value) {
      this.hely = {}
      this.keszlet = []
      if (!this.helynev) { return }
      try {
        let result = await odoo.model.searchRead('chance.hely', [['name', '=', this.helynev], ['szefo_e', '=', true], ['active', '=', true]])
        if (result.length) {
          this.hely = result.records[0]
          this.message = ''
        }
        this.readKeszlet()
      }
      catch (e) {
        this.message = e.message
        console.log(e)
      }
    },

    async checkCikkszam (value) {
      this.cikk = {}
      this.keszlet = []
      if (this.cikkszam.length < 5) { return }
      try {
        let result = await odoo.model.searchRead('chance.cikk', [['cikkszam', '=', this.cikkszam], ['active', '=', true]])
        if (!result.length) { return }
        this.cikk = result.records[0]
        this.readKeszlet()
      }
      catch (e) {
        this.message = e.message
        console.log(e)
      }
    },

    checkOsztaly (value) {
      this.osztaly = this.osztaly.toUpperCase()
      this.readKeszlet()
    }
  }
}
</script>

<style scoped lang="stylus">
.q-if
  margin-top unset
.text-margin-top
  margin-top 0.4em
.flex-container
  display flex
  justify-content space-between
.min-space
  display inline
  min-width 2em
</style>
