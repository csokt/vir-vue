<template>
  <div class="row justify-center">
    <div style="width: 750px; max-width: 95vw;">
      <q-list dense separator no-border>
        <q-item>
          <q-item-side image="statics/icons/eszkozinformacio-logo.png" />
          <h5 class="on-right">Tárgyi eszköz információk</h5>
        </q-item>
        <q-item v-if="message">
          <h6> {{message}} </h6>
        </q-item>
        <q-item v-show="odooConnected">
          <q-field class="full-width" label="Leltári szám" labelWidth=3 >
            <q-input type="text" v-model="leltariSzam" clearable=true />
            <strong> {{eszkoz && eszkoz.name}} </strong>
            <br>
            <qrcode-reader v-if="!leltariSzam" @decode="gotQR" :video-constraints="{ width: 640, height: 480 }"> </qrcode-reader>
          </q-field>
        </q-item>
        <q-item v-if="eszkoz">
          <q-field class="full-width" label="Leltárcsoport" labelWidth=3>
            <strong> {{eszkoz.leltarcsoport_id[1]}} </strong>
          </q-field>
        </q-item>
        <q-item v-if="eszkoz">
          <q-field class="full-width" label="Aktuális leltárkörzet" labelWidth=3>
            <strong> {{eszkoz.akt_leltarkorzet_id[1]}} </strong>
          </q-field>
        </q-item>
        <q-item v-if="eszkoz && eszkoz.akt_hasznalo_id">
          <q-field class="full-width" label="Aktuális használó" labelWidth=3>
            <strong> {{eszkoz.akt_hasznalo_id[1]}} </strong>
          </q-field>
        </q-item>
        <q-item v-if="eszkoz && eszkoz.megjegyzes">
          <q-field class="full-width" label="Megjegyzés" labelWidth=3>
            <strong> {{eszkoz.megjegyzes}} </strong>
          </q-field>
        </q-item>
        <q-item v-if="eszkoz && eszkoz.selejtezni">
          <q-field class="full-width" label="Selejtezni" labelWidth=3>
            <strong> igen </strong>
          </q-field>
        </q-item>
        <q-item v-if="eszkoz && mozgas.length">
          <q-field class="full-width" label="Eszköz mozgásai" labelWidth=3>
            <div v-for="row in mozgas">
              <div>{{utc2local(row.create_date)}}</div>
              <div>{{row.hova_leltarkorzet_id[1]}}</div>
              <hr>
            </div>
          </q-field>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
import API from '../rest.js'
// import odoo from '../odoo-jsonrpc'
import { QrcodeReader } from 'vue-qrcode-reader'
import {
  QField,
  QInput,
  QAutocomplete,
  QBtn,
  QList,
  QListHeader,
  QItem,
  QItemSeparator,
  QItemSide,
  QItemMain
} from 'quasar'

function queryParams (params) {
  return '?params=' + JSON.stringify(params)
}

export default {
  name: 'app',
  components: {
    QrcodeReader,
    QField,
    QInput,
    QAutocomplete,
    QBtn,
    QList,
    QListHeader,
    QItem,
    QItemSeparator,
    QItemSide,
    QItemMain
  },
  data () {
    return {
      leltariSzam: '',
      eszkoz: null,
      mozgas: [],
      enableQrcodeReader: false,
      odooConnected: false,
      message: ''
    }
  },

  created: async function () {
    // function urlParam (name) {
    //   const results = new RegExp('[\\?&]' + name + '=([^&#]*)', 'i').exec(window.location.href)
    //   return results ? results[1] : null
    // }

    try {
      this.odooConnected = false
      this.message = 'Kapcsolódás...'
      // odoo.setHost('.')
      // const db = urlParam('db') || 'raktar'
      // await odoo.login(db, 'frontend', 'Szefo1953')
      this.odooConnected = true
    }
    catch (e) {
      this.message = 'Nincs kapcsolat az adatbázissal!'
      console.log(e)
    }
    this.message = ''
  },

  watch: {
    leltariSzam: function (value) {
      this.checkLeltariSzam()
    }
  },

  methods: {
    utc2local (utc) {
      return new Date(utc.replace(/ /, 'T') + 'Z').toLocaleString()
    },

    gotQR (value) {
      this.leltariSzam = value
    },

    async checkLeltariSzam () {
      let params = {domain: [['leltari_szam', '=', this.leltariSzam]], frontend: true}
      let response = await API.get('vir/searchRead/leltar.eszkoz' + queryParams(params))
      if (response.ok && response.data.length) {
        console.log('data', response.data)
        this.eszkoz = response.data[0]

        params = {domain: [['eszkoz_id', '=', this.eszkoz.id]], frontend: true}
        response = await API.get('vir/searchRead/leltar.eszkozmozgas' + queryParams(params))
        this.mozgas = response.data
      }
      else {
        this.eszkoz = null
      }

      // try {
      //   let result = await odoo.model.searchRead('leltar.eszkoz', [['leltari_szam', '=', this.leltariSzam]])
      //   if (result.length) {
      //     this.eszkoz = result.records[0]
      //     result = await odoo.model.searchRead('leltar.eszkozmozgas', [['eszkoz_id', '=', this.eszkoz.id]])
      //     this.mozgas = result.records
      //   }
      //   else {
      //     this.eszkoz = null
      //   }
      // }
      // catch (e) {
      //   this.message = e.message
      //   console.log(e)
      // }
    }
  }
}
</script>

<style lang="stylus">
.q-item-image
  min-width unset
  width 50px
  height 50px

.q-item-avatar
  border-radius unset
  width 40px
  height 40px

.q-list
  padding unset

.row
  font-size 1.2rem
</style>
