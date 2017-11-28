<template>
  <div class="row justify-center">
    <div style="width: 750px; max-width: 95vw;">
      <q-list dense separator no-border>
        <q-item>
          <q-item-side avatar="statics/icons/eszkozinformacio-logo.png" />
          <h5 class="on-right">Tárgyi eszköz információk</h5>
        </q-item>
        <q-item v-if="message">
          <h6> {{message}} </h6>
        </q-item>
        <q-item v-if="odooConnected">
          <q-field class="full-width" label="Leltári szám" labelWidth=3 >
            <q-input type="text" v-model="leltariSzam" clearable=true />
            <strong> {{eszkoz && eszkoz.name}} </strong>
            <br>
            <QrcodeReader v-if="!leltariSzam" @decode="gotQR"> </QrcodeReader>
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
import odoo from '../odoo-jsonrpc'
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
    function urlParam (name) {
      const results = new RegExp('[\\?&]' + name + '=([^&#]*)', 'i').exec(window.location.href)
      return results ? results[1] : null
    }
    try {
      this.odooConnected = false
      this.message = 'Kapcsolódás...'
      odoo.setHost('.')
      const db = urlParam('db') || 'szefo'
      await odoo.login(db, 'frontend', 'Szefo1953')
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
      try {
        let result = await odoo.model.searchRead('leltar.eszkoz', [['leltari_szam', '=', this.leltariSzam]])
        if (result.length) {
          this.eszkoz = result.records[0]
          result = await odoo.model.searchRead('leltar.eszkozmozgas', [['eszkoz_id', '=', this.eszkoz.id]])
          this.mozgas = result.records
        }
        else {
          this.eszkoz = null
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
