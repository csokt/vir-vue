<template>
  <v-container grid-list-lg pa-2>
    <v-layout justify-space-around wrap>
      <BaseCard>
        <v-card-text>
          <SmartAutocomplete
            ref="hely"
            v-model="helyId"
            label="Hely"
            itemClass="body-2"
            :apiUrl="helyApiUrl"
            @searchInput="helySearchInput = $event"
            @change="hely = $event; $refs.cikkszam.focus()"
          />
          <SmartLookup
            ref="cikkszam"
            v-model="cikkszam"
            label="Cikkszám"
            :apiUrl="cikkApiUrl"
            @change="cikk = $event"
            @enter="$refs.megnevezes.focus()"
          />
          <v-text-field
            ref="osztaly"
            v-model="osztaly"
            mask="N"
            label="Osztály"
            clearable
            @keyup.enter="$refs.megnevezes.focus()"
          />
          <v-text-field
            ref="megnevezes"
            v-model="cikk.megnevezes"
            label="Megnevezés"
            readonly
          />
        </v-card-text>
      </BaseCard>

      <BaseCard title="Készlet">
        <v-card-text>
          <KeszletTable :apiUrl="keszletApiUrl"/>
        </v-card-text>
      </BaseCard>
    </v-layout>
  </v-container>
<!--
-->
</template>

<script>
import BaseCard from '@/components/core/BaseCard.vue'
import SmartAutocomplete from '@/components/core/SmartAutocomplete.vue'
import SmartLookup from '@/components/core/SmartLookup.vue'
import KeszletTable from '@/components/chance/KeszletTable.vue'

export default {
  name: 'chance-keszlet',
  components: {
    BaseCard,
    SmartAutocomplete,
    SmartLookup,
    KeszletTable
  },

  data () {
    return {
      helySearchInput: '', // SmartAutocomplete
      helyId: 0, // SmartAutocomplete
      hely: {}, // SmartAutocomplete
      cikkszam: '', // SmartLookup
      cikk: {}, // SmartLookup
      osztaly: '1' // v-text-field
    }
  },

  computed: {
    helyApiUrl () {
      const params = { domain: [['name', 'ilike', this.helySearchInput], ['szefo_e', '=', true]], order: 'name', limit: 10 }
      return 'vir/searchRead/chance.hely?params=' + JSON.stringify(params)
    },

    cikkApiUrl () {
      if (!this.cikkszam || this.cikkszam.length < 5) {
        return ''
      }
      const params = { domain: [['cikkszam', '=', this.cikkszam]], limit: 1 }
      return 'vir/searchRead/chance.cikk?params=' + JSON.stringify(params)
    },

    keszletApiUrl () {
      if (!this.hely.id || !this.cikk.cikkszam || !this.osztaly) return ''
      const params = { domain: [['hely_id', '=', this.hely.id], ['cikkszam', '=', this.cikk.cikkszam], ['osztaly', '=', this.osztaly], ['szefo_e', '=', true], ['raktaron', '!=', 0]], limit: 200 }
      return 'vir/searchRead/chance.keszlet?params=' + JSON.stringify(params)
    }
  },

  created () {
    this.$store.set('pageTitle', 'Készlet információk')
  }
}
</script>
