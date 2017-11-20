<template>
  <div id="app">
    <header>
      <div class="app-header">Tárgyi eszköz információk (QR)</div>
    </header>
    <main>
      <row :message=message>
        <input v-on:change="checkLeltariSzam" class="leltari-szam-input" type="text" size="9" v-model="leltariSzam" placeholder="Leltári szám"/>
        <button @click="enableQrcodeReader = !enableQrcodeReader" class="scan-button" type="button" >Beolvasás</button>
      </row>
      <qrcode-reader v-if="enableQrcodeReader" @capture="gotQR" head="Bejelentkezés" :defaultCamera="1" :mirror="false"></qrcode-reader>
      <template v-if="eszkoz">
        <row label="Leltári szám">
          {{eszkoz.leltari_szam}}
        </row>
        <row label="Eszköz név">
          {{eszkoz.megnevezes}}
        </row>
        <row label="Leltárcsoport">
          {{eszkoz.leltarcsoport_id[1]}}
        </row>
        <row label="Aktuális leltárkörzet">
          {{eszkoz.akt_leltarkorzet_id[1]}}
        </row>
        <row label="Aktuális használó">
          {{eszkoz.akt_hasznalo_id[1]}}
        </row>
        <row label="Megjegyzés">
          {{eszkoz.megjegyzes}}
        </row>
        <row label="Selejtezni">
          {{eszkoz.selejtezni}}
        </row>

        <hr>
        <div class="app-header"> Eszköz mozgásai </div>
        <hr>
        <div v-for="row in mozgas">
          <div> <b> Hova </b> </div>
          <div>{{row.hova_leltarkorzet_id[1]}}</div>
          <div class="intrarow"> <b> Mikor </b> </div>
          <td>{{utc2local(row.create_date)}}</td>
          <hr>
        </div>

      </template>
    </main>
  </div>
</template>

<script>
import odoo from './odoo-jsonrpc'
import QrcodeReader from './components/QrcodeReader.vue'
import Row from './components/Row.vue'

export default {
  name: 'app',
  data () {
    return {
      leltariSzam: '',
      eszkoz: null,
      message: '',
      mozgas: [],
      enableQrcodeReader: false,
      odooConnected: false,
      odooError: 'Kapcsolódás...'
    }
  },
  components: {
    'qrcode-reader': QrcodeReader,
    'row': Row
  },

  created: function () {
    let self = this
    odoo.setHost('.')
    const db = 'szefo'
    odoo.login(db, 'frontend', 'Szefo1953').then(
      function (result) {
        self.odooConnected = true
        self.odooError = ''
      },
      function (error) {
        self.odooError = 'Nincs kapcsolat az adatbázissal!'
        console.error(error)
      }
    )
  },
  methods: {
    utc2local (utc) {
      return new Date(utc + 'Z').toLocaleString()
    },

    gotQR (value) {
      this.leltariSzam = value
      this.checkLeltariSzam()
    },
    async checkLeltariSzam () {
      this.enableQrcodeReader = false
      try {
        this.message = ''
        let result = await odoo.model.searchRead('leltar.eszkoz', [['leltari_szam', '=', this.leltariSzam]])
        if (result.length) {
          this.eszkoz = result.records[0]
          result = await odoo.model.searchRead('leltar.eszkozmozgas', [['eszkoz_id', '=', this.eszkoz.id]])
          this.mozgas = result.records
        } else {
          this.eszkoz = null
          this.message = 'Érvénytelen leltári szám!'
        }
      } catch (e) {
        this.message = e.message
        console.log(e)
      }
    }
  }
}
</script>

<style>
#app {
  margin: 1em;
}
.app-header {
  color:blue;
  font-size: 140%;
}
.leltari-szam-input {
  font-size: 140%;
  margin-top: 0.2em;
  margin-bottom: 0.2em;
}
.scan-button {
  font-size: 140%;
}
.intrarow {
  margin-top: 0.5em;
}
</style>
