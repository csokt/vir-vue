<template>
  <div class="is-size-4">
    <div class="is-size-2">Teljesítmény kódolás</div>
    <br>
    <div v-if="store.user">

      <div class="tile is-ancestor tile-margin">
        <div class="tile is-child is-3">

          <my-input label="Gyártási lap">
            <input v-on:change="checkGyartasiLap" class="input is-large" type="number" v-model="store.gyartasi_lap_id"/>
          </my-input>

          <my-input label="Műveletkód">
            <input v-on:change="checkMuvelet" class="input is-large" type="number" v-model="store.muveletszam"/>
          </my-input>

          <my-input label="Mennyiség">
            <input class="input is-large" type="number" v-model="mennyiseg"/>
          </my-input>

          <button v-if="store.gyartasi_lap && store.gylap_szefo_muvelet && mennyiseg" @click="createMuveletvegzes" class="button is-info is-large">Mentés</button>

        </div>

        <div class="tile is-child is-1">
        </div>

        <div class="tile is-child">
          <br>
          <table class="table is-bordered">
            <tbody>
              <tr>
                <th>Kódoló</th>
                <td>{{store.user.name}}</td>
              </tr>

              <tr>
                <th>Gyártási&nbsp;hely</th>
                <td>{{store.user.hely}}</td>
              </tr>

              <tr v-if="store.dolgozo">
                <th>Dolgozó</th>
                <td>{{store.dolgozo.name}}</td>
              </tr>

              <tr v-if="store.gyartasi_lap">
                <th>Gyártási lap</th>
                <td>{{store.gyartasi_lap.name}}</td>
              </tr>

              <tr v-if="store.gylap_szefo_muvelet">
                <th>Művelet</th>
                <td>{{store.gylap_szefo_muvelet.name}}</td>
              </tr>

              <tr v-if="store.gylap_szefo_muvelet">
                <th>Összes db</th>
                <td>{{store.gylap_szefo_muvelet.osszes_db}}</td>
              </tr>

              <tr v-if="store.gylap_szefo_muvelet">
                <th>Kész db</th>
                <td>{{store.gylap_szefo_muvelet.kesz_db}}</td>
              </tr>

            </tbody>
          </table>
          <button @click="scanDolgozo=true; messageDolgozo=''" type="button" class="button is-danger is-large">Új dolgozó</button>
          <button @click="$router.go(-1)" type="button" class="button is-dark is-large">Vissza</button>
        </div>
      </div>

      <div class="has-text-danger">{{message}}</div>

      <table class="table is-bordered is-size-5">
        <thead>
          <tr>
            <th>Művelet</th>
            <th>Dolgozó</th>
            <th class="has-text-right">Menny.</th>
            <th>Létrehozás</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in muveletvegzes">
            <td>{{row.szefo_muvelet_id[1]}}</td>
            <td>{{row.szemely_id[1]}}</td>
            <td class="has-text-right">{{row.mennyiseg}}</td>
            <td>{{utc2local(row.create_date)}}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="scanDolgozo || !store.dolgozo" class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-content">
          <qrcode-reader @capture="checkDolgozo" head="Dolgozó beolvasás" :message="messageDolgozo"></qrcode-reader>
        </div>
        <button @click="scanDolgozo=false" class="modal-close is-large" aria-label="close"></button>
      </div>
    </div>
    <div v-else>
      <button @click="$router.push('/')" type="button">Jelentkezzen be!</button>
    </div>
  </div>
</template>
<!--
            <td>{{row.muvelet.name}}</td>
            <td>{{row.dolgozo.name}}</td>
-->

<script>
import odoo from '../odoo-jsonrpc'
import {store} from '../store'
import Input from './Input.vue'
import QrcodeReader from './QrcodeReader.vue'

export default {
  name: 'teszt',
  data () {
    return {
      store: store,
      message: '',
      muveletvegzes: [],
      mennyiseg: null,
      scanDolgozo: false,
      messageDolgozo: ''
    }
  },
  components: {
    'my-input': Input,
    'qrcode-reader': QrcodeReader
  },

  created: function () {
    if (store.user) {
      this.selectMuveletvegzes()
    }
  },

  methods: {
    utc2local (utc) {
      return new Date(utc + 'Z').toLocaleString()
    },

    async createMuveletvegzes () {
      try {
        this.message = null
        const row = {
          szefo_muvelet_id: this.store.gylap_szefo_muvelet.id,
          hely_id: this.store.user.hely_id[0],
          szemely_id: this.store.dolgozo.id,
          mennyiseg: this.mennyiseg,
          megjegyzes: 'lir',
          nexon_azon: this.store.dolgozo.SzemelyId,
          felvette_id: this.store.user.user_id[0]
        }
        await odoo.model.create('legrand.muveletvegzes', row)
        this.selectMuveletvegzes()
        this.store.muveletszam = null
        this.store.gylap_szefo_muvelet = null
        this.mennyiseg = null
      } catch (e) {
        this.message = e.message
        console.log(e)
      }
    },

    async selectMuveletvegzes () {
      try {
//        let result = await odoo.model.searchRead('legrand.muveletvegzes', [['create_uid', '=', store.user.user_id[0]]], [], 5)
        let result = await odoo.model.searchRead('legrand.muveletvegzes', [['felvette_id', '=', store.user.user_id[0]]], [], 5)
        this.muveletvegzes = result.records
      } catch (e) {
        this.message = e.message
        console.log(e)
      }
    },

    async checkDolgozo (value) {
      try {
        let result = await odoo.model.searchRead('nexon.szemely', [['SzemelyId', '=', parseInt(value)]])
        if (result.length) {
          this.store.dolgozo = result.records[0]
          this.scanDolgozo = false
        } else {
          this.messageDolgozo = 'Érvénytelen dolgozó kód!'
        }
      } catch (e) {
        this.messageDolgozo = e.message
        console.log(e)
      }
    },

    async checkGyartasiLap () {
      this.message = null
      this.store.gyartasi_lap = null
      this.store.muveletszam = null
      this.store.gylap_szefo_muvelet = null
      this.mennyiseg = null
      if (this.store.gyartasi_lap_id) {
        try {
          let result = await odoo.model.find('legrand.gyartasi_lap', this.store.gyartasi_lap_id)
          if (result) {
            this.store.gyartasi_lap = result
          } else {
            this.message = 'Érvénytelen gyártási lap!'
          }
        } catch (e) {
          this.message = e.message
          console.log(e)
        }
      }
    },

    async checkMuvelet () {
      this.message = null
      this.store.gylap_szefo_muvelet = null
      this.mennyiseg = null
      if (this.store.muveletszam) {
        try {
          let result = await odoo.model.searchRead('legrand.gylap_szefo_muvelet', [['gyartasi_lap_id', '=', this.store.gyartasi_lap.id], ['muveletszam', '=', this.store.muveletszam]])
          if (result.length) {
            this.store.gylap_szefo_muvelet = result.records[0]
          } else {
            this.message = 'Érvénytelen művelet!'
          }
        } catch (e) {
          this.message = e.message
          console.log(e)
        }
      }
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.button {
  margin: 0.5em;
}
.tile-margin {
  margin: 0px;
}
</style>

