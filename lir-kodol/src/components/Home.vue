<template>
  <div>
    <div class="title">Legrand Információs Rendszer</div>
    <div v-if="store.user">
      <div class="is-size-4 has-text-danger"> Üdvözlöm {{ store.user.name }} </div>
      <br>
      <button @click="store.user=null" type="button" class="button is-danger is-large">Kijelentkezés</button>
      <br>
      <button @click="$router.push('kodol')" type="button" class="button is-info is-large">Kódolás</button>
    </div>
    <div v-else>
      <button v-if="store.odooConnected" @click="scanUser=true" type="button" class="button is-danger is-large">Jelentkezzen be kódkártyájával!</button>
      <div class="is-size-4 has-text-danger"> {{ store.odooError }} </div>

      <div v-if="scanUser" class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-content">
          <qrcode-reader @capture="checkUser" head="Bejelentkezés" :message="messageUser"></qrcode-reader>
        </div>
        <button @click="scanUser=false" class="modal-close is-large" aria-label="close"></button>
      </div>

    </div>
  </div>
</template>

<script>
import odoo from '../odoo-jsonrpc'
import {store} from '../store'
import QrcodeReader from './QrcodeReader.vue'

export default {
  name: 'hello',
  data () {
    return {
      store: store,
      scanUser: false,
      messageUser: ''
    }
  },
  components: {
    'qrcode-reader': QrcodeReader
  },
  methods: {
    async checkUser (value) {
      try {
        let result = await odoo.model.searchRead('legrand.lir_user', [['qr', '=', parseInt(value)]], [])
        if (result.length) {
          this.store.user = result.records[0]
          this.scanUser = false
        } else {
          this.messageUser = 'Érvénytelen felhasználó kód!'
        }
      } catch (e) {
        this.messageUser = e.message
        console.log(e)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.button {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
</style>
