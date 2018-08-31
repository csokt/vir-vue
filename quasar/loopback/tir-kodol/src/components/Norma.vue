<template>
  <div class="row justify-center">
    <div style="width: 450px; max-width: 95vw;">
      <div class="text-faded text-bold text-center text-margin-top">Mai teljesítmény százalék</div>
      <h5 class="text-negative"> {{message}} </h5>
      <hr>
      <template v-if="store.user">
        <q-field class="full-width" label="Munkaidő kezdete" labelWidth=6>
          <q-datetime color="blue" v-model="store.kezdIdo" type="datetime" format24h no-clear cancel-label="Elvet" ok-label="Ment"/>
        </q-field>

        <q-field class="full-width" label="Aktuális idő" labelWidth=6>
          <q-datetime color="blue" v-model="aktIdo" type="time" format24h no-clear cancel-label="Elvet" ok-label="Ment"/>
        </q-field>

        <q-field class="full-width" label="Eltelt idő (perc)" labelWidth=6>
          <q-input v-model="elteltPerc" readonly></q-input>
        </q-field>

        <q-field class="full-width" label="Összes normaperc" labelWidth=6>
          <q-input v-model="osszesNormaperc" readonly></q-input>
        </q-field>

        <q-field class="full-width" label="Teljesítmény %" labelWidth=6>
          <q-input class="teljesitmeny" v-model="teljesitmeny" readonly></q-input>
        </q-field>

        <q-btn @click="$router.go(-1)" push color="warning">Vissza</q-btn>
      </template>
    </div>
  </div>
</template>

<script>
import Store from '../store'
import { RpcRaw, Log } from '../rpc'
import {
  QField,
  QInput,
  QDatetime,
  QBtn
} from 'quasar'

export default {
  name: 'norma',
  components: {
    QField,
    QInput,
    QDatetime,
    QBtn
  },
  data () {
    return {
      store: Store,
      aktIdo: new Date(),
      osszesNormaperc: 0,
      message: ''
    }
  },
  computed: {
    elteltPerc: function () {
      return Math.round((this.aktIdo - this.store.kezdIdo) / 60000)
    },
    teljesitmeny: function () {
      return Math.round(100 * this.osszesNormaperc / this.elteltPerc)
    }
  },
  methods: {
    async sumNormaperc () {
      Log('norma')
      this.message = ''
      try {
        const response = await RpcRaw('SELECT sum([Összes Normaperc]) AS sum FROM monitor_napikodolas where [Dolgozó kód] = ' + this.store.kodol.dolgozokod)
        this.osszesNormaperc = Math.round(response.result[0].sum)
      }
      catch (e) {
        this.message = 'Adatbázis hiba!'
        Log('message', {message: this.message})
        console.log(e)
      }
    }
  },

  created () {
    if (!this.store.user) { this.$router.replace('/'); return }
    Log('navigate')
    this.sumNormaperc()
  }
}
</script>

<style scoped lang="stylus">
.text-margin-top
  margin-top 0.4em
.name
  font-size 1.7rem
  margin-bottom 0.3em
.q-btn
  margin-top 0.5em
  margin-bottom 0.5em
  margin-right 0.7em
.row
  font-size 1.2rem
.teljesitmeny
  font-size 1.5rem
</style>
