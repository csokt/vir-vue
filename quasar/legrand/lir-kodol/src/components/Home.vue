<template>
  <div class="row justify-center">
    <div style="width: 350px; max-width: 95vw;">
      <q-list no-border dense>
        <q-list-header>
          <h5>Legrand művelet kódolás</h5>
        </q-list-header>
        <template v-if="store.odooConnected && store.user">
          <q-item>
            <h5> {{ store.user.name }} </h5>
          </q-item>
          <q-item>
            <span> {{ store.user.hely }} </span>
          </q-item>
          <q-item>
            <q-btn @click="$router.push('kodol')" push color="primary">Kódolás</q-btn>
            <q-btn @click="store.user=null;scanUser=true; store.userError=''" push color="negative">Kijelentkezés</q-btn>
          </q-item>
        </template>
        <template v-if="store.odooConnected && !store.user">
          <q-item>
            Jelentkezzen be kártyájával!
          </q-item>
          <q-item>
            <qrcode-reader v-show="scanUser" :video-constraints="store.video" @decode="checkUser"> </qrcode-reader>
          </q-item>
        </template>
        <q-item>
          <h5 class="text-negative"> {{message}} </h5>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>

import odoo from '../odoo-jsonrpc'
import Store from '../store'

import {
  QInput,
  QBtn,
  QList,
  QListHeader,
  QItem
} from 'quasar'

export default {
  name: 'home',
  components: {
    QInput,
    QBtn,
    QList,
    QListHeader,
    QItem
  },
  data () {
    return {
      store: Store,
      scanUser: true,
      message: ''
    }
  },
  methods: {
    async checkUser (value) {
      try {
        let result = await odoo.model.searchRead('legrand.lir_user', [['qr', '=', parseInt(value)]], [])
        if (result.length) {
          this.store.user = result.records[0]
          this.scanUser = false
          this.message = ''
        }
        else {
          this.message = 'Érvénytelen felhasználó kód!'
        }
      }
      catch (e) {
        this.message = e.message
        console.log(e)
      }
    }
  },

  created: async function () {
    if (this.store.odooConnected) { return }
    try {
      this.message = 'Kapcsolódás...'
      odoo.setHost('.')
      const db = this.$route.query.db || 'szefo'
      await odoo.login(db, 'frontend', 'Szefo1953')
      this.message = ''
      this.store.odooConnected = true
    }
    catch (e) {
      this.message = 'Nincs kapcsolat az adatbázissal!'
      console.log(e)
    }
  }
}
</script>

<style scoped lang="stylus">
.q-btn
  margin-top 2em
  margin-right 1em
.row
  font-size 1.2rem
.q-item
  font-size 1.2rem
</style>
