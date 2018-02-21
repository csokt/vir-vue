<template>
  <div class="row justify-center">
    <div style="width: 550px; max-width: 95vw;">
      <div class="text-faded text-bold text-center text-margin-top">Legrand készlet információk</div>
      <hr>
      <div v-show="odooConnected">
        <q-field class="full-width" label="Cikkszám" labelWidth=3>
          <q-input ref="cikkszam" v-on:change="checkCikkszam" type="text" v-model="cikkszam" clearable=true></q-input>
          <div class="text-margin-top">
            <strong> {{cikknev}} </strong>
          </div>
          <qrcode-reader v-if="!cikkszam" :video-constraints="{ width: 640, height: 480 }" @decode="checkCikkszam"> </qrcode-reader>
          <q-btn v-if="cikkszam" @click="cikkszam=''; cikknev=''" push color="faded">Új cikk</q-btn>
        </q-field>

        <q-field v-if="cikkszam" class="full-width" label="Készlet" labelWidth=3>
          <table class="q-table striped cell-separator bordered">
            <thead>
              <tr>
                <th>Raktárhely</th>
                <th>Előrejelzés</th>
                <th>Raktáron</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in keszlet">
                <td>{{row.hely_id[1]}}</td>
                <td class="text-right">{{row.varhato}}</td>
                <td class="text-right">{{row.raktaron}}</td>
              </tr>
            </tbody>
          </table>
        </q-field>
      </div>
      <h5 class="text-negative"> {{message}} </h5>
    </div>
  </div>
</template>

<script>
import odoo from '../odoo-jsonrpc'
import { QrcodeReader } from 'vue-qrcode-reader'
import {
  QField,
  QInput,
  QBtn
} from 'quasar'

export default {
  name: 'app',
  components: {
    QrcodeReader,
    QField,
    QInput,
    QBtn
  },
  data () {
    return {
      cikkszam: '',
      cikknev: '',
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
    async checkCikkszam (value) {
      if (!this.cikkszam) { this.cikkszam = value }
      if (this.cikkszam.length < 6) {
        this.cikknev = ''
        this.keszlet = []
        return
      }
      try {
        let result = await odoo.model.searchRead('legrand.keszlet', [['cikk_id.cikkszam', '=', this.cikkszam], ['szefo_e', '=', true]])
        if (result.length) {
          this.cikknev = result.records[0].cikknev
          this.keszlet = result.records
        }
        else {
          this.cikknev = ''
          this.keszlet = []
        }
      }
      catch (e) {
        this.message = e.message
        console.log(e)
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.text-margin-top
  margin-top 0.4em
.q-btn
  margin-top 1em
</style>
