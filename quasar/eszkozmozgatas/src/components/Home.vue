<template>
  <div class="row justify-center">
    <div style="width: 750px; max-width: 95vw;">
      <q-list dense separator no-border>
        <q-item>
          <q-item-side avatar="statics/icons/eszkozmozgatas-logo.png" />
          <h5 class="on-right">Tárgyi eszköz mozgatás</h5>
        </q-item>
        <q-item v-if="message">
          <h6> {{message}} </h6>
        </q-item>
        <q-item v-if="!odooConnected">
          <q-field class="full-width" label="Bejelentkezés" labelWidth=3 :error="!!odooMessage" :error-label=odooMessage>
            <q-input v-model="username" float-label="Belépési név" />
            <q-input v-model="password" type="password" float-label="Jelszó" />
            <q-btn @click="login" push color="primary">Bejelentkezés</q-btn>
          </q-field>
        </q-item>
        <q-item v-if="odooConnected">
          <q-field class="full-width" label="Felhasználó" labelWidth=3>
            <strong> {{user && user.name}} </strong>
          </q-field>
        </q-item>
        <q-item v-if="odooConnected">
          <q-field class="full-width" label="Új leltárkörzet" labelWidth=3 >
            <q-input v-model="leltarkorzetKod" clearable=true >
              <q-autocomplete
                @search="searchLeltarkorzet"
                :debounce="500"
              />
            </q-input>
            <div> <strong> {{korzet && korzet.name}} </strong> </div>
          </q-field>
        </q-item>
        <q-item v-if="odooConnected && korzet">
          <q-field class="full-width" label="Leltári szám" labelWidth=3 >
            <q-input type="text" v-model="leltariSzam" clearable=true />
            <strong> {{eszkoz && eszkoz.name}} </strong>
            <br>
            <QrcodeReader v-if="!leltariSzam" @decode="gotQR"> </QrcodeReader>
          </q-field>
        </q-item>
        <q-item v-if="odooConnected && korzet && eszkoz">
          <q-field class="full-width" label="Régi leltárkörzet" labelWidth=3>
          <div> <strong> {{eszkoz && eszkoz.akt_leltarkorzet_id[1]}} </strong> </div>
            <q-btn v-if="korzet.id != eszkoz.akt_leltarkorzet_id[0]" @click="mozgat" push color="secondary">Átvitel az új körzetbe</q-btn>
          </q-field>
        </q-item>
      </q-list>
    </div>
  </div>
<!--
-->
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

function parseKorzetek (korzetek) {
  return korzetek.map(korzet => {
    return {
      label: korzet.name,
      value: korzet.leltarkorzet_kod
    }
  })
}

export default {
  name: 'home',
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
      username: '',
      password: '',
      user: null,
      leltarkorzetKod: '',
      leltariSzam: '',
      korzet: null,
      eszkoz: null,
      odooConnected: false,
      odooMessage: '',
      message: ''
    }
  },
  watch: {
    leltarkorzetKod: function (value) {
      this.checkLeltarkorzet()
    },

    leltariSzam: function (value) {
      this.checkLeltariSzam()
    }
  },

  methods: {
    async login () {
      function urlParam (name) {
        const results = new RegExp('[\\?&]' + name + '=([^&#]*)', 'i').exec(window.location.href)
        return results ? results[1] : null
      }
      try {
        this.odooConnected = false
        this.odooMessage = ''
        this.message = 'Kapcsolódás...'
        odoo.setHost('.')
        const db = urlParam('db') || 'szefo'
        // let result = await odoo.login(db, 'frontend', 'Szefo1953')
        let result = await odoo.login(db, this.username, this.password)
        this.user = await odoo.model.find('res.users', result.uid, ['name', 'company_id'])
        this.odooConnected = true
      }
      catch (e) {
        this.odooMessage = 'Nincs kapcsolat az adatbázissal!'
        console.log(e)
      }
      this.message = ''
    },

    gotQR (value) {
      this.leltariSzam = value
    },

    async searchLeltarkorzet (terms, done) {
      try {
        let result = await odoo.model.searchRead('leltar.korzet', [['name', 'ilike', terms]], ['id', 'leltarkorzet_kod', 'name'], 8)
        done(parseKorzetek(result.records))
      }
      catch (e) {
        this.message = e.message
        console.log(e)
      }
    },

    async mozgat () {
      try {
        const row = {
          eszkoz_id: this.eszkoz.id,
          hova_leltarkorzet_id: this.korzet.id
          // megerkezett: true
        }
        await odoo.model.create('leltar.eszkozmozgas', row)
        this.checkLeltariSzam()
      }
      catch (e) {
        this.message = e.message
        console.log(e)
      }
    },

    async checkLeltarkorzet () {
      try {
        let result = await odoo.model.searchRead('leltar.korzet', [['leltarkorzet_kod', '=', this.leltarkorzetKod]])
        if (result.length) {
          this.korzet = result.records[0]
        }
        else {
          this.korzet = null
        }
      }
      catch (e) {
        this.message = e.message
        console.log(e)
      }
    },

    async checkLeltariSzam () {
      try {
        let result = await odoo.model.searchRead('leltar.eszkoz', [['leltari_szam', '=', this.leltariSzam]])
        if (result.length) {
          this.eszkoz = result.records[0]
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
