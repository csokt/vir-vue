<template>
  <div class="row justify-center">
    <div style="width: 750px; max-width: 95vw;">
      <q-list dense separator no-border>
        <q-item>
          <q-item-side image="statics/icons/eszkozmozgatas-logo.png" />
          <h5 class="on-right">Tárgyi eszköz mozgatás</h5>
        </q-item>
        <q-item v-if="message">
          <h6> {{message}} </h6>
        </q-item>
        <q-item v-if="odooConnected">
          <q-field class="full-width" label="Felhasználó" labelWidth=3>
            <strong> {{store.user.name}} </strong>
          </q-field>
        </q-item>
        <q-item v-if="odooConnected">
          <q-field class="full-width" label="Új leltárkörzet" labelWidth=3 >
            <q-input v-model="leltarkorzetKod" clearable=true @keyup.enter="$refs.leltariSzam.focus()">
              <q-autocomplete
                @search="searchLeltarkorzet"
                :debounce="500"
              />
            </q-input>
            <div> <strong> {{korzet && korzet.name}} </strong> </div>
          </q-field>
        </q-item>
        <q-item v-show="odooConnected && korzet">
          <q-field class="full-width" label="Leltári szám" labelWidth=3 >
            <q-input ref="leltariSzam" v-model="leltariSzam" clearable=true />
            <strong> {{eszkoz && eszkoz.name}} </strong>
            <br>
            <qrcode-reader v-if="!leltariSzam" @decode="gotQR" :video-constraints="{ width: 640, height: 480 }"> </qrcode-reader>
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
import { QrcodeReader } from 'vue-qrcode-reader'
import API from '../rest.js'
import Store from '../store'
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

function queryParams (params) {
  return '?params=' + JSON.stringify(params)
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
      store: Store,
      leltarkorzetKod: '',
      leltariSzam: '',
      korzet: null,
      eszkoz: null,
      odooMessage: '',
      message: ''
    }
  },

  computed: {
    odooConnected () {
      return this.store.user.id
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
    gotQR (value) {
      this.leltariSzam = value
    },

    async searchLeltarkorzet (terms, done) {
      const params = {domain: [['name', 'ilike', terms]], fields: ['id', 'leltarkorzet_kod', 'name'], limit: 8}
      const response = await API.get('vir/searchRead/leltar.korzet' + queryParams(params))
      if (response.ok) {
        done(parseKorzetek(response.data))
      }
    },

    async mozgat () {
      const params = {
        eszkoz_id: this.eszkoz.id,
        hova_leltarkorzet_id: this.korzet.id
        // megerkezett: true
      }
      const response = await API.post('vir/create/leltar.eszkozmozgas', params)
      if (response.ok) {
        this.checkLeltariSzam()
      }
      else {
        this.message = response.problem
        console.log(response.problem)
      }
    },

    async checkLeltarkorzet () {
      const params = {domain: [['leltarkorzet_kod', '=', this.leltarkorzetKod]], limit: 1}
      const response = await API.get('vir/searchRead/leltar.korzet' + queryParams(params))
      if (response.ok && response.data.length) {
        this.korzet = response.data[0]
      }
      else {
        this.korzet = null
      }
    },

    async checkLeltariSzam () {
      const params = {domain: [['leltari_szam', '=', this.leltariSzam]], limit: 1}
      const response = await API.get('vir/searchRead/leltar.eszkoz' + queryParams(params))
      if (response.ok && response.data.length) {
        this.eszkoz = response.data[0]
      }
      else {
        this.eszkoz = null
      }
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

.q-btn
  margin-top 1em

.q-list
  padding unset

.row
  font-size 1.2rem
</style>
