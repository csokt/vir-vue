<template>
  <v-container pa-0>
    <v-layout justify-space-around wrap>
      <BaseCard>
        <v-card-text>
          <LookupHely
            v-model="kodol.hely"
            @input="kodol.helynev = ''"
            @change="kodol.helynev = $event.kodnev"
          />
          <v-text-field
            v-model="kodol.helynev"
            label="Helynév"
            readonly
          />
          <LookupUzem
            v-if="kodol.hely == '90026'"
            v-model="kodol.uzemkod"
            @input="kodol.uzemnev = ''"
            @change="kodol.uzemnev = $event.uzemnev"
          />
          <v-text-field
            v-if="kodol.hely == '90026'"
            v-model="kodol.uzemnev"
            label="Uzemnév"
            readonly
          />
          <LookupMunkalap
            v-model="kodol.munkalapazonosito"
            @input="kodol.kartoninfo = ''"
            @change="onChangeMunkalap"
          />
          <v-text-field
            v-model="kodol.kartoninfo"
            label="Kartoninfo"
            readonly
          />
          <v-card-actions>
            <v-btn
              :disabled="!ervenyes || feldolgozas"
              color="primary"
              @click="pubKodolas"
            >
              Adatok mentése
            </v-btn>
          </v-card-actions>
        </v-card-text>
      </BaseCard>
      <BaseCard>
        <table>
          <thead>
            <tr>
              <th>Helykód&nbsp;&nbsp;</th>
              <th>Munkalap&nbsp;&nbsp;</th>
              <th>Eredmény</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row,index) in atadasok"
              :key="index"
              v-bind:class="{ 'red--text': row.error }"
            >
              <td>{{row.hely}}</td>
              <td>{{row.munkalap}}</td>
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
import LookupHely from '@/components/LookupHely.vue'
import LookupUzem from '@/components/LookupUzem.vue'
import LookupMunkalap from '@/components/LookupMunkalap.vue'

export default {
  name: 'kodol',
  components: {
    BaseCard,
    LookupHely,
    LookupUzem,
    LookupMunkalap
  },

  data () {
    return {
      kodol: {},
      feldolgozas: false,
      atadasok: []
    }
  },

  computed: {
    ...get(['user']),

    ervenyes () {
      return this.kodol.helynev && this.kodol.kartoninfo && (this.kodol.hely !== '90026' || this.kodol.uzemnev)
    }
  },

  methods: {
    onChangeMunkalap (item) {
      this.kodol.kartoninfo = item.kartoninfo
      if (!item.munkalapazonosito) { return }
      this.$store.set('defaults@munkalapazonosito', item.munkalapazonosito)
      this.$store.set('defaults@cikkszam', item.cikkszam)
    },

    async pubKodolas () {
      // Log('kodol', this.store.kodol)
      let message = ''
      this.feldolgozas = true
      let doc = { ...this.kodol, funkcio: this.kodol.hely }
      if (!doc.uzemkod) { doc.uzemkod = '0' }
      this.atadasok.unshift(doc)
      const response = await API.post('tir/atad', doc)
      if (response.ok) {
        doc.eredmeny = response.data.message
        doc.error = parseInt(response.data.error)
        if (doc.error) {
          message = 'Nem sikerült átadni!'
        }
      } else {
        message = 'Kódoló szerver hiba, értesítse a rendszergazdát!'
        doc.eredmeny = 'Kódoló szerver hiba!'
        doc.error = 1
        // Log('message', {message: message})
        // console.log(response.problem)
      }
      this.feldolgozas = false
      if (message) {
        EventBus.$emit('inform', { type: 'alert', variation: 'error', message: message })
        return
      }
      EventBus.$emit('inform', { type: 'alert', variation: 'success', message: 'Átadva!' })
    }
  },

  created () {
    this.$store.set('pageTitle', 'Átadás')
    this.kodol = this.$store.copy('kodol')
    this.atadasok = this.$store.copy('atadasok')
  },

  destroyed () {
    this.$store.set('kodol', this.kodol)
    this.$store.set('atadasok', this.atadasok)
  }
}
</script>
