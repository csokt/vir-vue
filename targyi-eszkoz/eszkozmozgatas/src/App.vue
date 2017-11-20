<template>
  <div id="app">
    <menusor img="/static/img/icons/apple-touch-icon-60x60.png" name="Tárgyi eszköz mozgatás"></menusor>
    <row v-if="!odooConnected" label="Bejelentkezés" :message=odooMessage>
      <input type="text" v-model="username" placeholder="Login név"/>
      <br>
      <input type="password" v-model="password" placeholder="Jelszó"/>
      <br>
      <button @click="login" type="button" >Bejelentkezés</button>
    </row>
    <template v-if="odooConnected">
      <row label="Felhasználó">
        {{user && user.name}}
      </row>
      <row label="Új leltárkörzet" :message=korzetMessage>
        <input v-on:change="checkLeltarkorzet" type="text" v-model="leltarkorzetKod" placeholder="Leltárkörzet"/>
        <br>
        {{korzet && korzet.name}}
      </row>
      <template v-if="korzet">
        <row label="Leltári szám" :message=eszkozMessage>
          <input v-on:change="checkLeltariSzam" type="text" v-model="leltariSzam" placeholder="Leltári szám"/>
          <br>
          {{eszkoz && eszkoz.name}}
          <br>
          <button v-if="eszkoz && (korzet.id != eszkoz.akt_leltarkorzet_id[0])" @click="mozgat" type="button">Átvitel az új körzetbe</button>
        </row>
        <row v-if="eszkoz" label="Régi leltárkörzet">
          {{eszkoz && eszkoz.akt_leltarkorzet_id[1]}}
        </row>
      </template>
    </template>
  </div>
</template>

<script>
import odoo from './odoo-jsonrpc'
import Menusor from './components/Menusor.vue'
import Row from './components/Row.vue'

export default {
  name: 'app',
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
  components: {
    'menusor': Menusor,
    'row': Row
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
        let result = await odoo.login(db, 'frontend', 'Szefo1953')
        // let result = await odoo.login(db, this.username, this.password)
        console.log(db, 'bejelentkezett')
        this.user = await odoo.model.find('res.users', result.uid, ['name', 'company_id'])
        console.log(this.user)
        this.odooConnected = true
        this.odooMessage = ''
      } catch (e) {
        this.odooMessage = 'Nincs kapcsolat az adatbázissal!'
        console.log(e)
      }
    },
    gotQR (value) {
      this.leltariSzam = value
      this.checkLeltariSzam()
    },
    mozgat () {
    },
    async checkLeltarkorzet () {
      this.enableQrcodeReader = false
      try {
        this.korzetMessage = ''
        let result = await odoo.model.searchRead('leltar.korzet', [['leltarkorzet_kod', '=', this.leltarkorzetKod]])
        if (result.length) {
          this.korzet = result.records[0]
        } else {
          this.korzet = null
          this.korzetMessage = 'Érvénytelen leltárkörzet!'
        }
      } catch (e) {
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
        } else {
          this.eszkoz = null
          this.eszkozMessage = 'Érvénytelen leltári szám!'
        }
      } catch (e) {
        this.eszkozMessage = e.message
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
</style>
