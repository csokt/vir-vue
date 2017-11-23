<template>
  <div class="row justify-center">
    <div style="width: 500px; max-width: 95vw;">
      <q-list dense separator no-border>
        <q-item>
          <q-item-side avatar="statics/icons/eszkozmozgatas-logo.png" />
          <h5 class="on-right">Tárgyi eszköz mozgatás</h5>
        </q-item>
        <q-item v-if="!odooConnected">
          <q-field class="full-width" label="Bejelentkezés" labelWidth=3 :error="!!odooMessage" :error-label=odooMessage>
            <q-input v-model="username" float-label="Login név" />
            <!--
            -->
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
          <q-field class="full-width" label="Új leltárkörzet" labelWidth=3 :message=korzetMessage>
            <q-input v-on:change="checkLeltarkorzet" type="text" v-model="leltarkorzetKod" placeholder="Leltárkörzet"/>
            <div> <strong> {{korzet && korzet.name}} </strong> </div>
          </q-field>
        </q-item>
        <q-item v-if="odooConnected && korzet">
          <q-field class="full-width" label="Leltári szám" labelWidth=3 :message=eszkozMessage>
            <q-input v-on:change="checkLeltariSzam" type="text" v-model="leltariSzam" placeholder="Leltári szám"/>
            <strong> {{eszkoz && eszkoz.name}} </strong>
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
</template>

<script>
import odoo from '../odoo-jsonrpc'
import {
  QField,
  QInput,
  QBtn,
  QList,
  QListHeader,
  QItem,
  QItemSeparator,
  QItemSide,
  QItemMain
} from 'quasar'

export default {
  name: 'home',
  components: {
    QField,
    QInput,
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
      korzetMessage: '',
      eszkoz: null,
      eszkozMessage: '',
      enableQrcodeReader: false,
      odooConnected: false,
      odooMessage: ''
    }
  },
  methods: {
    utc2local (utc) {
      return new Date(utc + 'Z').toLocaleString()
    },

    async login () {
      function urlParam (name) {
        const results = new RegExp('[\\?&]' + name + '=([^&#]*)', 'i').exec(window.location.href)
        return results ? results[1] : null
      }
      try {
        this.odooMessage = 'Kapcsolódás...'
        odoo.setHost('.')
        const db = urlParam('db') || 'szefo'
        // let result = await odoo.login(db, 'frontend', 'Szefo1953')
        let result = await odoo.login(db, this.username, this.password)
        console.log(db, 'bejelentkezett')
        this.user = await odoo.model.find('res.users', result.uid, ['name', 'company_id'])
        console.log(this.user)
        this.odooConnected = true
        this.odooMessage = ''
      }
      catch (e) {
        this.odooMessage = 'Nincs kapcsolat az adatbázissal!'
        console.log(e)
      }
    },

    gotQR (value) {
      this.leltariSzam = value
      this.checkLeltariSzam()
    },

    async mozgat () {
      try {
        this.eszkozMessage = ''
        const row = {
          eszkoz_id: this.eszkoz.id,
          hova_leltarkorzet_id: this.korzet.id
          // megerkezett: true
        }
        await odoo.model.create('leltar.eszkozmozgas', row)
        this.checkLeltariSzam()
      }
      catch (e) {
        this.eszkozMessage = e.message
        console.log(e)
      }
    },

    async checkLeltarkorzet () {
      this.enableQrcodeReader = false
      try {
        this.korzetMessage = ''
        let result = await odoo.model.searchRead('leltar.korzet', [['leltarkorzet_kod', '=', this.leltarkorzetKod]])
        if (result.length) {
          this.korzet = result.records[0]
        }
        else {
          this.korzet = null
          this.korzetMessage = 'Érvénytelen leltárkörzet!'
        }
      }
      catch (e) {
        this.korzetMessage = e.message
        console.log(e)
      }
    },

    async checkLeltariSzam () {
      this.enableQrcodeReader = false
      try {
        this.eszkozMessage = ''
        let result = await odoo.model.searchRead('leltar.eszkoz', [['leltari_szam', '=', this.leltariSzam]])
        if (result.length) {
          this.eszkoz = result.records[0]
        }
        else {
          this.eszkoz = null
          this.eszkozMessage = 'Érvénytelen leltári szám!'
        }
      }
      catch (e) {
        this.eszkozMessage = e.message
        console.log(e)
      }
    }
  }
}
</script>

<style lang="stylus">
.q-btn
  margin-top 2em
</style>
