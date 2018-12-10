<template>
  <v-container grid-list-lg>
    <v-layout justify-space-around wrap>
      <BaseCard>
        <v-card-text>
          <SmartAutocomplete
            ref="hely"
            v-model="helyId"
            label="Hely"
            itemClass="body-2"
            :apiUrl="apiUrl"
            @searchInput="searchInput = $event"
            @change="hely = $event; $refs.cikkszam.focus()"
          />
          <v-text-field
            ref="cikkszam"
            v-model="cikkszam"
            label="Cikkszám"
            clearable
            @keyup.enter="$refs.megnevezes.focus()"
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
          <KeszletTable :searchParams="keszletSearchParams"/>
        </v-card-text>
      </BaseCard>
    </v-layout>
  </v-container>
<!--
-->
</template>

<script>
import { API, checkResponse } from '@/util'
import BaseCard from '@/components/base/BaseCard.vue'
import SmartAutocomplete from '@/components/base/SmartAutocomplete.vue'
import KeszletTable from '@/components/chance/KeszletTable.vue'

export default {
  name: 'chance-keszlet',
  components: {
    BaseCard,
    SmartAutocomplete,
    KeszletTable
  },

  data () {
    return {
      searchInput: '',
      helyId: 0,
      cikkszam: '',
      osztaly: '1',
      hely: {},
      cikk: {}
    }
  },

  computed: {
    apiUrl () {
      const params = { domain: [['name', 'ilike', this.searchInput], ['szefo_e', '=', true]], order: 'name', limit: 10 }
      return 'vir/searchRead/chance.hely?params=' + JSON.stringify(params)
    },

    keszletSearchParams () {
      if (!this.hely.id || !this.cikk.id || !this.osztaly) return ''
      const params = { domain: [['hely_id', '=', this.hely.id], ['cikkszam', '=', this.cikkszam], ['osztaly', '=', this.osztaly], ['szefo_e', '=', true], ['raktaron', '!=', 0]], limit: 200 }
      return JSON.stringify(params)
    }
  },

  watch: {
    cikkszam: async function () {
      this.cikk = {}
      if (this.cikkszam.length < 5) { return }
      const params = { domain: [['cikkszam', '=', this.cikkszam]], limit: 1 }
      const response = await API.get('vir/searchRead/chance.cikk?params=' + JSON.stringify(params))
      if (!checkResponse(response)) return
      if (response.data.length) {
        this.cikk = response.data[0]
      }
    }
  },

  created () {
    this.$store.set('pageTitle', 'Készlet információk')
  }
}
</script>
