<template>
  <v-container pa-0>
    <v-layout justify-space-around wrap>
      <BaseCard>
        <v-card-text>
          <LookupDolgozo v-model="kodol.dolgozokod" :readonly="user.role!=='kódoló'" @change="kodol.dolgozonev = $event.dolgozonev"/>
          <v-text-field v-model="kodol.dolgozonev" label="Dolgozó" readonly/>
          <LookupMunkalap v-model="kodol.munkalapazonosito"  @change="kodol.kartoninfo = $event.kartoninfo"/>
          <v-text-field v-model="kodol.kartoninfo" label="Kartoninfo" readonly/>
          <v-text-field v-model="kodol.gepkod" type="number" label="Gépkód"/>
          <v-combobox v-model="kodol.muveletkodok" type="number" multiple chips deletable-chips clearable required label="Műveletkódok"/>
          <v-text-field v-model="kodol.mennyiseg" type="number" label="Mennyiség"/>
          <v-card-actions>
            <v-btn :disabled="!ervenyes || feldolgozas" color="primary" @click="pubKodolas">Adatok mentése</v-btn>
          </v-card-actions>
        </v-card-text>
      </BaseCard>
      <BaseCard>
        <table class="q-table striped cell-separator bordered compact">
          <thead>
            <tr>
              <th>Műv.kód</th>
              <th>Menny.</th>
              <th>Eredmény</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row,index) in kodolasok" :key="index" v-bind:class="{ 'red--text': row.error }">
              <td>{{row.muveletkod}}</td>
              <td>{{row.mennyiseg}}</td>
              <td>{{row.eredmeny}}</td>
            </tr>
          </tbody>
        </table>
      </BaseCard>
    </v-layout>
  </v-container>
</template>

<script>
import { get } from 'vuex-pathify'
import { API, EventBus } from '@/util'
import BaseCard from '@/components/core/BaseCard.vue'
import LookupDolgozo from '@/components/LookupDolgozo.vue'
import LookupMunkalap from '@/components/LookupMunkalap.vue'

export default {
  name: 'munkalap',
  components: {
    BaseCard,
    LookupDolgozo,
    LookupMunkalap
  },

  data () {
    return {
      kodol: {},
      feldolgozas: false,
      kodolasok: []
    }
  },

  computed: {
    ...get(['user']),

    ervenyes () {
      return this.kodol.dolgozonev && this.kodol.kartoninfo && this.kodol.muveletkodok.length && parseInt(this.kodol.mennyiseg) > 0
    }
  },

  methods: {
    async pubKodolas () {
      if (this.kodol.gepkod !== parseInt(this.kodol.gepkod).toString() || parseInt(this.kodol.gepkod) < 0) {
        EventBus.$emit('inform', { type: 'alert', variation: 'warning', message: 'Érvénytelen gépkód!' })
        return
      }
      for (const kod of this.kodol.muveletkodok) {
        if (kod !== parseInt(kod).toString() || parseInt(kod) < 1) {
          EventBus.$emit('inform', { type: 'alert', variation: 'warning', message: 'Érvénytelen műveletkód!' })
          return
        }
      }
      if (this.kodol.mennyiseg !== parseInt(this.kodol.mennyiseg).toString() || parseInt(this.kodol.mennyiseg) < 0) {
        EventBus.$emit('inform', { type: 'alert', variation: 'warning', message: 'Érvénytelen mennyiség!' })
        return
      }
      // Log('kodol', this.store.kodol)
      let message = ''
      this.feldolgozas = true
      for (const kod of this.kodol.muveletkodok) {
        this.kodol.muveletkod = kod
        let doc = Object.assign({}, this.kodol)
        doc.funkcio = '99994'
        this.kodolasok.unshift(doc)
        const response = await API.post('tir/kodol', doc)
        if (response.ok) {
          this.kodolasok[0].eredmeny = response.data.message
          this.kodolasok[0].error = parseInt(response.data.error)
          if (this.kodolasok[0].error) {
            message = 'Nem minden tételt sikerült bekódolni!'
          }
        } else {
          message = 'Kódoló szerver hiba, értesítse a rendszergazdát!'
          this.kodolasok[0].eredmeny = 'Kódoló szerver hiba!'
          this.kodolasok[0].error = 1
          // Log('message', {message: message})
          console.log(response.problem)
          break
        }
      }
      this.feldolgozas = false
      if (message) {
        EventBus.$emit('inform', { type: 'alert', variation: 'error', message: message })
        return
      }
      EventBus.$emit('inform', { type: 'alert', variation: 'success', message: 'Tételek bekódolva!' })
      this.kodol.mennyiseg = ''
    }
  },

  created () {
    this.$store.set('pageTitle', 'Teljesítmény kódolás')
    this.kodol = this.$store.copy('kodol')
    this.kodolasok = this.$store.copy('kodolasok')
  },

  destroyed () {
    this.$store.set('kodol', this.kodol)
    this.$store.set('kodolasok', this.kodolasok)
  }
}
</script>
