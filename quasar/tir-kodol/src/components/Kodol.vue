<template>
  <div class="row justify-center">
    <div style="width: 750px; max-width: 95vw;">
      <q-list dense separator no-border>
        <q-item>
          <h5>Teljesítmény kódolás</h5>
        </q-item>
        <q-item v-if="message">
          <h5> {{message}} </h5>
        </q-item>
        <q-item v-if="!store.user">
          <h5> Jelentkezzen be! </h5>
        </q-item>

        <template v-if="store.user">
          <q-item>
            <q-field class="full-width" label="Dolgozó" labelWidth=3>
              <strong> {{store.kodol.dolgozo}} </strong>
              <q-input v-if="!store.kodol.dolgozo" type="number" v-model="qrcode" @keyup.enter="gotDolgozoQR(qrcode)"></q-input>
              <qrcode-reader v-if="!store.kodol.dolgozo" :video-constraints="store.video" @decode="gotDolgozoQR"> </qrcode-reader>
            </q-field>
          </q-item>

          <template v-if="store.kodol.dolgozo">
            <q-item>
              <q-field class="full-width" label="Munkalap" labelWidth=3 >
                <q-input ref="munkalap" type="number" v-model="store.kodol.munkalap" clearable=true @keyup.enter="$refs.muveletkod.focus()"></q-input>
                <qrcode-reader v-if="!store.kodol.munkalap" :video-constraints="store.video" @decode="gotMunkalapQR"> </qrcode-reader>
              </q-field>
            </q-item>
            <q-item>
              <q-field class="full-width" label="Műveletkód" labelWidth=3 >
                <q-input ref="muveletkod" type="number" v-model="store.kodol.muveletkod" clearable=true @keyup.enter="$refs.mennyiseg.focus()"/>
                <br>
              </q-field>
            </q-item>
            <q-item>
              <q-field class="full-width" label="Mennyiség" labelWidth=3 >
                <q-input ref="mennyiseg" type="number" v-model="store.kodol.mennyiseg" clearable=true />
                <br>
              </q-field>
            </q-item>
          </template>

          <q-item>
            <q-item-main>
              <q-btn v-if="store.menthet && store.kodol.munkalap && store.kodol.muveletkod && store.kodol.mennyiseg" @click="pubKodolas" push color="positive">Adatok mentése</q-btn>
              <q-btn @click="$router.go(-1)" push color="warning">Vissza</q-btn>
              <q-btn v-if="store.menthet && store.kodol.munkalap" @click="ujMunkalap" push color="tertiary">Új munkalap</q-btn>
              <q-btn v-if="store.menthet && store.kodol.dolgozo && store.user.role==='kódoló'" @click="ujDolgozo" push color="tertiary">Új dolgozó</q-btn>
            </q-item-main>
          </q-item>

        </template>
      </q-list>
      <br>
      <table class="q-table striped cell-separator">
        <thead>
          <tr>
            <th>Eredmény</th>
            <th>Dolgozó</th>
            <th>Munkalap</th>
            <th>Műveletkód</th>
            <th>Mennyiség</th>
          </tr>
        </thead>
        <tbody>
            <tr v-for="doc in store.kodolasok">
              <td>{{doc.eredmeny}}</td>
              <td>{{doc.dolgozo}}</td>
              <td>{{doc.munkalap}}</td>
              <td>{{doc.muveletkod}}</td>
              <td>{{doc.mennyiseg}}</td>
            </tr>
        </tbody>
      </table>

    </div>
  </div>
<!--
          <q-item>
            <q-field class="full-width" label="Felhasználó" labelWidth=3>
              <strong> {{store.user.name}} </strong>
            </q-field>
          </q-item>
          <q-item>
            <q-field class="full-width" label="Telephely" labelWidth=3>
              <strong> {{store.kodol.telephely}} </strong>
            </q-field>
          </q-item>
          <q-item>
            <q-field class="full-width" label="Kódoló" labelWidth=3>
              <strong> {{store.kodol.kodolo}} </strong>
            </q-field>
          </q-item>
-->
</template>

<script>
import Store from '../store'
import { RpcRaw, RpcKodol } from '../rpc'
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
  name: 'kodol',
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
      store: Store,
      qrcode: null,
      message: ''
    }
  },
  methods: {
    async gotDolgozoQR (value) {
      const qr = parseInt(value)
      if (!qr) {
        this.message = 'Csak számot lehet megadni!'
        return
      }
      this.message = ''
      if (qr < 20000) {
        this.message = 'A kód 20000-nél nem lehet kisebb!'
      }
      else {
        this.store.kodol.dolgozokod = value
        const dolgozokod = qr - 20000
        const response = await RpcRaw("select [dolgozokod], [dolgozonev] from [dolgtr] where [aktiv] = 'A' and [dolgozokod] = " + dolgozokod.toString())
        if (response.result && response.result.length) {
          this.store.kodol.dolgozo = response.result[0].dolgozonev.trim()
          this.$refs.munkalap.focus()
        }
        else {
          this.message = 'Érvénytelen dolgozó kód!'
        }
      }
    },

    gotMunkalapQR (value) {
      console.log(value)
      this.store.kodol.munkalap = value
      this.$refs.muveletkod.focus()
    },

    async pubKodolas () {
      let doc = Object.assign({}, this.store.kodol)
      doc.funkcio = 99994
      doc.createdAt = new Date()
      this.store.kodolasok.unshift(doc)
      this.store.menthet = false
      const response = await RpcKodol(doc)
      console.log(response)
      if (response.result) {
        this.store.kodolasok[0].eredmeny = response.result.message
      }
      else {
        this.store.kodolasok[0].eredmeny = 'Hiba!'
      }
      this.store.menthet = true
      this.store.kodol.muveletkod = null
      this.store.kodol.mennyiseg = null
    },

    ujMunkalap () {
      this.store.kodol.munkalap = null
      this.store.kodol.muveletkod = null
      this.store.kodol.mennyiseg = null
    },

    ujDolgozo () {
      this.store.kodol.dolgozokod = null
      this.store.kodol.dolgozo = null
      this.store.kodol.munkalap = null
      this.store.kodol.muveletkod = null
      this.store.kodol.mennyiseg = null
    }
  }
}
</script>

<style scoped lang="stylus">
.q-btn
  margin-top 2em
  margin-right 2em
</style>
