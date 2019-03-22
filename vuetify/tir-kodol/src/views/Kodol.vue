<template>
  <v-container pa-0>
    <v-layout justify-space-around wrap>
      <BaseCard>
        <v-card-text>
          <LookupDolgozo v-model="kodol.dolgozokod"  @change="kodol.dolgozo = $event"/>
          <v-text-field v-model="kodol.dolgozo.dolgozonev" label="Dolgozó" readonly/>
          <LookupMunkalap v-model="kodol.munkalapazonosito"  @change="kodol.munkalap = $event"/>
          <v-text-field v-model="kodol.munkalap.kartoninfo" label="Kartoninfo" readonly/>
          <v-text-field v-model="kodol.gepkod" type="number" label="Gépkód"/>
          <v-combobox v-model="kodol.muveletkodok" type="number" multiple chips deletable-chips clearable required label="Műveletkódok"/>
          <v-text-field v-model="kodol.mennyiseg" type="number" label="Mennyiség"/>
          <v-card-actions>
            <v-btn color="primary" @click="pubKodolas">Adatok mentése</v-btn>
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
            <tr v-for="(row,index) in kodolasok" :key="index" v-bind:class="{ 'text-negative': row.error }">
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
// import { get } from 'vuex-pathify'
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
      kodol: { dolgozo: {}, munkalap: {} },
      kodolasok: []
    }
  },

  computed: {
    // ...get(['kodolasok'])
  },

  methods: {
    async pubKodolas () {
      try {
        if (this.gepkod !== parseInt(this.gepkod) || this.gepkod < 0) {
          throw new TypeError('Érvénytelen gépkód!')
        }
      } catch (e) {
        this.message = 'Érvénytelen gépkód!'
        // Log('message', {message: e.message})
        console.log(e)
        return
      }
      for (let i = 0; i < this.muveletkodok.length; i++) {
        try {
          const kod = this.muveletkodok[i]
          if (Math.ceil(parseFloat(kod)) !== parseInt(kod) || parseInt(kod) <= 0) {
            throw new TypeError('Érvénytelen műveletkód!')
          }
        } catch (e) {
          this.message = 'Érvénytelen műveletkód!'
          // Log('message', {message: e.message})
          console.log(e)
          return
        }
      }
      try {
        if (this.mennyiseg !== parseInt(this.mennyiseg) || this.mennyiseg <= 0) {
          throw new TypeError('Érvénytelen mennyiség!')
        }
      } catch (e) {
        this.message = 'Érvénytelen mennyiség!'
        // Log('message', {message: e.message})
        console.log(e)
        return
      }

      // this.mennyiseg = ''
      EventBus.$emit('inform', { type: 'alert', variation: 'success', message: 'Adatok elküldve!' })

      this.gepkod = this.gepkod || 0
      // Log('kodol', this.store.kodol)
      this.message = ''
      this.store.menthet = false
      for (let i = 0; i < this.muveletkodok.length; i++) {
        this.muveletkod = this.muveletkodok[i]
        let doc = Object.assign({}, this.store.kodol)
        doc.funkcio = 99994
        doc.createdAt = new Date()
        this.store.kodolasok.unshift(doc)
        const response = await API.post('tir/kodol', doc)
        if (response.ok) {
          this.store.kodolasok[0].eredmeny = response.data.message
          this.store.kodolasok[0].error = parseInt(response.data.error)
          if (this.store.kodolasok[0].error) {
            this.message = 'Nem minden tételt sikerült bekódolni!'
          }
        } else {
          this.message = 'Kódoló szerver hiba, értesítse a rendszergazdát!'
          this.store.kodolasok[0].eredmeny = 'Kódoló szerver hiba!'
          this.store.kodolasok[0].error = 1
          // Log('message', {message: this.message})
          console.log(response.problem)
          break
        }
      }
      if (!this.message) {
        if (this.store.user.role !== 'szabó') {
          this.muveletkodok = []
        }
        this.mennyiseg = null
      }
      this.store.menthet = true
    }
  },

  created () {
    this.$store.set('pageTitle', 'Teljesítmény kódolás')
    this.kodol = this.$store.copy('kodol')
  }
}
</script>
